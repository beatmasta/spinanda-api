import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
    ],
    providers: [ApiService],
    controllers: [ApiController],
    exports: [ApiService],
})
export class ApiModule {}
