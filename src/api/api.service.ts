import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import * as NodeCache from 'node-cache';

@Injectable()
export class ApiService {

    #cache: NodeCache;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {
        this.#cache = new NodeCache({ stdTTL: configService.get<number>('CACHE_TTL') });
    }

    private async fetchWithRetry(url: string, retries: number = 3): Promise<AxiosResponse> {
        for (let i = 0; i < retries; i++) {
            try {
                return await lastValueFrom(this.httpService.get(url));
            } catch (error) {
                if (i === retries - 1) {
                    throw new HttpException('Failed to fetch data', HttpStatus.BAD_REQUEST);
                }
            }
        }
        throw new HttpException('Failed to fetch data', HttpStatus.BAD_REQUEST);
    }

    async getWeather(city: string): Promise<AxiosResponse> {
        const apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        return this.fetchWithRetry(url);
    }

    async getCryptoPrice(currency: string): Promise<AxiosResponse> {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`;
        return this.fetchWithRetry(url);
    }

    async getData(city: string, currency: string, refresh: boolean = false): Promise<any> {
        const cacheKey = `${city}-${currency}`;

        if (!refresh && this.#cache.has(cacheKey)) {
            return this.#cache.get(cacheKey);
        }

        let weather, crypto;

        try {
            weather = await this.getWeather(city);
        } catch (error) {
            throw new HttpException('Failed to fetch weather data', HttpStatus.BAD_REQUEST);
        }

        try {
            crypto = await this.getCryptoPrice(currency);
        } catch (error) {
            throw new HttpException('Failed to fetch cryptocurrency data', HttpStatus.BAD_REQUEST);
        }

        const data = {
            city,
            temperature: `${Math.round(weather.data.main.temp - 273.15)}°C`,
            weather: weather.data.weather[0].description,
            crypto: {
                name: currency,
                price_usd: crypto.data[currency].usd
            }
        };

        this.#cache.set(cacheKey, data);

        return data;
    }
}
