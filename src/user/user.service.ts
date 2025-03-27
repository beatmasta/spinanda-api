import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import {Role, User, UserType} from './user.entity';
import * as bcrypt from 'bcryptjs';
import {UpdateResult} from "typeorm/query-builder/result/UpdateResult";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    create(user: Partial<User>): Promise<User> {
        return this.usersRepository.save(user);
    }

    async update(id: string, user: Partial<User>): Promise<UpdateResult> {
        return await this.usersRepository.update(id, user);
    }

    async remove(id: string): Promise<DeleteResult> {
        return await this.usersRepository.delete(id);
    }

    async insertMockData(): Promise<void> {
        const mockUsers: UserType[] = [
            { name: 'user1', email: 'user1@gmail.com', password: 'password1', role: Role.ADMIN },
            { name: 'user2', email: 'user2@gmail.com', password: 'password2', role: Role.USER },
        ];

        for (const user of mockUsers) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        try {
            await this.usersRepository.save(mockUsers);
        } catch(e) {
            console.error('Error inserting mock data', e.message);
        }
    }
}
