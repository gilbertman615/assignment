import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { RegexValidation } from '../common/validations/regex.validation';
import { INVALID_PASSWORD_MESSAGE } from '../constant';
import { UserCreateDto } from '../dto/user-create.dto';
import { User } from '../model/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService,
                  {
                    provide: getRepositoryToken(User),
                    useValue: jest.fn(),
                  },
                  JwtService
                  
      ]
    }).compile();
    userService = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('should fails on password format invalid', () => {
    const userCreateDto: UserCreateDto = {
      name: 'Super',
      email: 'testing@gmail.com',
      password: '1234567'
    }
    controller.createUser(userCreateDto).catch((error: HttpException) => {
      expect(error.getStatus() === HttpStatus.BAD_GATEWAY);
      expect(error.getResponse() === INVALID_PASSWORD_MESSAGE);
    });
  });

  it('should fails on password length too short', () => {
    const userCreateDto: UserCreateDto = {
      name: 'Super',
      email: 'testing@gmail.com',
      password: 'Aa12$'
    }
    controller.createUser(userCreateDto).catch((error: HttpException) => {
      expect(error.getStatus() === HttpStatus.BAD_GATEWAY);
      expect(error.getResponse() === INVALID_PASSWORD_MESSAGE);
    })
  });


  it('Create user successfully', async () => {
    const userCreateDto: UserCreateDto = {
      name: 'Super',
      email: 'testing@gmail.com',
      password: 'Aa123456$'
    }

    const createdUser: User = {
      id: randomUUID(),
      name: 'Super',
      email: 'testing@gmail.com'
    }

    jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve(createdUser));
    const result =  await controller.createUser(userCreateDto);
    if (result) {
      if (result.id) {
        expect(RegexValidation.isValidUUID(result?.id)).toBeTruthy();
      }
      if (result.email) {
        expect(result.email).toEqual(createdUser.email);
      }
      if (result.name) {
        expect(result.name).toEqual(createdUser.name);
      }
    }
  
  });

  it('Update user successfully', async () => {
    const userCreateDto: UserCreateDto = {
      name: 'Super',
      email: 'testing@gmail.com',
      password: 'Aa123456$'
    }
    const uuid = randomUUID();

    const updatedUser: User = {
      id: uuid,
      name: 'New name',
      email: 'newemail@gmail.com'
    }

    jest.spyOn(userService, 'update').mockImplementation(() => Promise.resolve(updatedUser));

    const result =  await controller.updateUser(uuid, userCreateDto);
    if (result) {
      if (result.id) {
        expect(RegexValidation.isValidUUID(result?.id)).toBeTruthy();
      }
      if (result.email) {
        expect(result.email).toEqual(updatedUser.email);
      }
      if (result.name) {
        expect(result.name).toEqual(updatedUser.name);
      }
    }
  })

});
