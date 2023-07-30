import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSearchDto } from '../dto/user-search.dto';
import { User } from '../model/user.entity';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserValidation } from '../common/validations/user.validation';
import { QueryFailedError } from 'typeorm';
import { RegexValidation } from '../common/validations/regex.validation';
import { AuthGuard } from '../auth/auth.guard';


@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @ApiOperation({summary: 'Get all users or get users by conditions'})
    @Get()
    async getUsers(@Query() userSearchCriteria: UserSearchDto): Promise<User[]>  {
        if (Object.keys(userSearchCriteria).length === 0) {
            return await this.usersService.findAll();
        } else {
            return await this.usersService.findByConditions(userSearchCriteria);
        }
    }

    @ApiOperation({summary: 'Get user by id'})
    @ApiResponse({ status: 200, description: 'Get user successfully'})
    @ApiResponse({ status: 400, description: 'Invalid input'})
    @Get(":id")
    async getUserById(@Param('id') uuid: string): Promise<User | null>  {
        if (!RegexValidation.isValidUUID(uuid)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        }
        const user: User | null = await this.usersService.findOneByUuid(uuid);
        if (user != null) {
            return user;
        }
        return null;
    }

    @ApiOperation({summary: 'Create user'})
    @ApiResponse({ status: 201, description: 'Create user successfully'})
    @ApiResponse({ status: 400, description: 'Invalid input'})
    @ApiResponse({ status: 409, description: 'User email already exists'})
    @Post()
    async createUser(@Body() userCreateDto: UserCreateDto): Promise<User | null> {
        UserValidation.isValidRequest(userCreateDto);
        try {
            return await this.usersService.createUser(userCreateDto);
        } catch (err) {
            throw this.exceptionHandlingForUserCreateAndUpdate(err, userCreateDto);
        }
    }

    @ApiOperation({summary: 'Update user'})
    @ApiResponse({ status: 200, description: 'Update user successfully'})
    @ApiResponse({ status: 400, description: 'Invalid input'})
    @ApiResponse({ status: 409, description: 'User email already exists'})
    @Put(":id")
    async updateUser(@Param('id') uuid: string, @Body() updateUserDto: UserCreateDto): Promise<User | null>  {
        UserValidation.isValidRequest(updateUserDto);
        try {
            return await this.usersService.update(uuid, updateUserDto);
        } catch (err) {
            throw this.exceptionHandlingForUserCreateAndUpdate(err, updateUserDto);
        }
    }

    @ApiOperation({summary: 'Delete user'})
    @ApiResponse({ status: 200, description: 'Delete user successfully'})
    @ApiResponse({ status: 400, description: 'Bad request invalid user input'})
    @Delete(":id")
    async deleteUser(@Param('id') uuid: string): Promise<HttpStatus> {
        if (!RegexValidation.isValidUUID(uuid)) {
            throw new HttpException('Invalid UUID', HttpStatus.BAD_REQUEST);
        }
        const deleteResult = await this.usersService.remove(uuid);
        if (deleteResult.affected) {
            if (deleteResult.affected < 1) {
                throw new HttpException('UUID not found', HttpStatus.NOT_FOUND);
            }
        }
        return HttpStatus.OK;
    }

    private exceptionHandlingForUserCreateAndUpdate(err: any, inputDto: UserCreateDto) {
        if (err instanceof QueryFailedError) {
            if (err.driverError.code === '23505') {
                if (err.driverError.constraint === 'email_unique') {
                    throw new HttpException(`Email ${inputDto.email} already exists`, HttpStatus.CONFLICT);
                }
            }
        }
        // throw default err
        throw err;
    }

}

