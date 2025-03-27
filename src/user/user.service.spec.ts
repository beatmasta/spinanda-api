import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import ResolvedValue = jest.ResolvedValue;

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService, UserService>(UserService);
    repository = module.get<Repository<User>, Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const users = [{ id: '1', name: 'Test User' }];
    jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);
    expect(await service.findAll()).toEqual(users);
  });

  it('should find one user by id', async () => {
    const user = { id: '1', name: 'Test User' };
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user as User);
    expect(await service.findOneById('1')).toEqual(user);
  });

  it('should find one user by email', async () => {
    const user = { id: '1', email: 'test@example.com' };
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user as User);
    expect(await service.findOneByEmail('test@example.com')).toEqual(user);
  });

  it('should create a user', async () => {
    const user = { id: '1', name: 'Test User' };
    jest.spyOn(repository, 'save').mockResolvedValue(user as User);
    expect(await service.create(user)).toEqual(user);
  });

  it('should update a user', async () => {
    const user = { id: '1', name: 'Updated User' };
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    await service.update('1', user);
    expect(repository.update).toHaveBeenCalledWith('1', user);
  });

  it('should remove a user', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    await service.remove('1');
    expect(repository.delete).toHaveBeenCalledWith('1');
  });

  it('should insert mock data', async () => {
    const mockUsers = [
      { name: 'user1', email: 'user1@gmail.com', password: 'password1', role: 'admin' },
      { name: 'user2', email: 'user2@gmail.com', password: 'password2', role: 'user' },
    ];
    jest.spyOn(repository, 'save').mockResolvedValue(mockUsers as ResolvedValue<User[]>);
    await service.insertMockData();
    expect(repository.save).toHaveBeenCalledWith(mockUsers);
  });
});
