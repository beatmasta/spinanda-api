import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: LoginDto) {
        const userData = await this.validateUser(user.email, user.password);
        if (!userData) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        const payload = { username: user.email, sub: userData.id, role: userData.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(user: RegisterDto) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const createUser = await this.userService.create({ ...user, password: hashedPassword });
        if (createUser) {
            const {password, ...rest} = createUser;
            return rest;
        }
        return null;
    }
}
