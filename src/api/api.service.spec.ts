import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import {AxiosResponse, InternalAxiosRequestConfig, RawAxiosResponseHeaders} from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ApiService', () => {
  let service: ApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data', async () => {
      const city = 'London';
      const apiKey = 'test-api-key';
      const weatherResponse: AxiosResponse = {
        data: { main: { temp: 280.32 }, weather: [{ description: 'clear sky' }] },
        status: 200,
        statusText: 'OK',
        headers: {} as RawAxiosResponseHeaders,
        config: {} as InternalAxiosRequestConfig,
      };

      jest.spyOn(configService, 'get').mockReturnValue(apiKey);
      jest.spyOn(httpService, 'get').mockReturnValue(of(weatherResponse));

      const result = await service.getWeather(city);
      expect(result).toEqual(weatherResponse);
    });

    it('should throw an error if fetching weather data fails', async () => {
      const city = 'London';
      const apiKey = 'test-api-key';

      jest.spyOn(configService, 'get').mockReturnValue(apiKey);
      jest.spyOn(httpService, 'get').mockReturnValue(of(Promise.reject(new Error('Failed to fetch data'))));

      await expect(service.getWeather(city)).rejects.toThrow(HttpException);
    });
  });

  describe('getCryptoPrice', () => {
    it('should return cryptocurrency price data', async () => {
      const currency = 'bitcoin';
      const cryptoResponse: AxiosResponse = {
        data: { bitcoin: { usd: 50000 } },
        status: 200,
        statusText: 'OK',
        headers: {} as RawAxiosResponseHeaders,
        config: {} as InternalAxiosRequestConfig,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(cryptoResponse));

      const result = await service.getCryptoPrice(currency);
      expect(result).toEqual(cryptoResponse);
    });

    it('should throw an error if fetching cryptocurrency data fails', async () => {
      const currency = 'bitcoin';

      jest.spyOn(httpService, 'get').mockReturnValue(of(Promise.reject(new Error('Failed to fetch data'))));

      await expect(service.getCryptoPrice(currency)).rejects.toThrow(HttpException);
    });
  });

  describe('getData', () => {
    it('should return combined weather and cryptocurrency data', async () => {
      const city = 'London';
      const currency = 'bitcoin';
      const weatherResponse: AxiosResponse = {
        data: { main: { temp: 280.32 }, weather: [{ description: 'clear sky' }] },
        status: 200,
        statusText: 'OK',
        headers: {} as RawAxiosResponseHeaders,
        config: {} as InternalAxiosRequestConfig,
      };
      const cryptoResponse: AxiosResponse = {
        data: { bitcoin: { usd: 50000 } },
        status: 200,
        statusText: 'OK',
        headers: {} as RawAxiosResponseHeaders,
        config: {} as InternalAxiosRequestConfig,
      };

      jest.spyOn(service, 'getWeather').mockResolvedValue(weatherResponse);
      jest.spyOn(service, 'getCryptoPrice').mockResolvedValue(cryptoResponse);

      const result = await service.getData(city, currency, true);
      expect(result).toEqual({
        city,
        temperature: '7°C',
        weather: 'clear sky',
        crypto: {
          name: currency,
          price_usd: 50000,
        },
      });
    });

    it('should throw an error if fetching weather data fails', async () => {
      const city = 'London';
      const currency = 'bitcoin';

      jest.spyOn(service, 'getWeather').mockRejectedValue(new HttpException('Failed to fetch weather data', HttpStatus.BAD_REQUEST));
      jest.spyOn(service, 'getCryptoPrice').mockResolvedValue({} as AxiosResponse);

      await expect(service.getData(city, currency, true)).rejects.toThrow(HttpException);
    });

    it('should throw an error if fetching cryptocurrency data fails', async () => {
      const city = 'London';
      const currency = 'bitcoin';

      jest.spyOn(service, 'getWeather').mockResolvedValue({} as AxiosResponse);
      jest.spyOn(service, 'getCryptoPrice').mockRejectedValue(new HttpException('Failed to fetch cryptocurrency data', HttpStatus.BAD_REQUEST));

      await expect(service.getData(city, currency, true)).rejects.toThrow(HttpException);
    });
  });
});
