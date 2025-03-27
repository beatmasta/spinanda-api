import {Controller, Post, Body, Get, UseGuards, Request, NotFoundException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {UserService} from "../user/user.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully registered.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Log in and receive a JWT token' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the authenticated user\'s profile' })
    @ApiResponse({ status: 200, description: 'The user profile has been successfully retrieved.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.userService.findOneById(req.user.userId);
        if (user) {
            const {password, ...rest} = user;
            return rest;
        }
        return new NotFoundException('Profile not found');
    }
}
