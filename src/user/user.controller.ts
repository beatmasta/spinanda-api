import { Controller, Get, Param, Patch, Delete, Body, UseGuards, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { User } from './user.entity';
import { UpdateUserDto } from './dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles('admin')
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
    }

    @Roles('admin')
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', required: true, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOneById(id);
        if (user) {
            const { password, ...rest } = user;
            return rest;
        }
        throw new NotFoundException('User not found');
    }

    @Roles('admin')
    @Patch(':id')
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiParam({ name: 'id', required: true, description: 'User ID' })
    @ApiBody({ type: User, description: 'Partial user data to update' })
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const { affected } = await this.userService.update(id, updateUserDto);
        if (!affected) {
            throw new NotFoundException('User not found');
        }
    }

    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiParam({ name: 'id', required: true, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        const { affected } = await this.userService.remove(id);
        if (!affected) {
            throw new NotFoundException('User not found');
        }
    }
}
