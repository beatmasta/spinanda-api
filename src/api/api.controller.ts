import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetDataDto } from './dto';

@ApiTags('data')
@Controller()
export class ApiController {
    constructor(private apiService: ApiService) {}

    @Get('/data')
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getData(@Query() query: GetDataDto) {
        const { city, currency, refresh } = query;

        if (!city || !currency) {
            throw new BadRequestException('City and currency are required parameters');
        }

        const refreshFlag = refresh === 'true';

        return this.apiService.getData(city, currency, refreshFlag);
    }
}
