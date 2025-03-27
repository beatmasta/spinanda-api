import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiService } from './api/api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import {UserService} from "./user/user.service";
import {ApiController} from "./api/api.controller";
import {UserController} from "./user/user.controller";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {ApiModule} from "./api/api.module";
import {AuthController} from "./auth/auth.controller";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    ApiModule,
  ],
  controllers: [ApiController, UserController, AuthController],
  providers: [],
  exports: [],
})
export class AppModule {}
