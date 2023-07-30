import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, ILike, Like, Repository } from 'typeorm';
import { UserCreateDto } from '../dto/user-create.dto';
import { MatchType, UserSearchDto } from '../dto/user-search.dto';
import { User } from '../model/user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../auth/constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    // omit password on return response
    userSelectFilter = {
        id: true,
        name: true,
        email: true
    }

    async findAll(): Promise<User[]> {
        const users :User[] = await this.userRepository.find({select: this.userSelectFilter});
        return users;
    }

    async createUser(userCreateDto: UserCreateDto): Promise<User> {
        const hash = await bcrypt.hash(userCreateDto.password, SALT_ROUNDS);
        userCreateDto.password = hash;
        const { password, ...user} = await this.userRepository.save(UserCreateDto.toUserDto(userCreateDto));
        return user;
    }

    findOneByUuid(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: {
                id
            },
            select: this.userSelectFilter
        });
    }

    findByConditions(userSearchCriteria: UserSearchDto): Promise<User[]> {
        if (userSearchCriteria.matchType === MatchType.EXACT) {
            return this.userRepository.find({
                where: {
                name: userSearchCriteria.name ? Equal(userSearchCriteria.name): Like('%'),
                email: userSearchCriteria.email ? Equal(userSearchCriteria.email): Like('%')
                },
                select: this.userSelectFilter
            });
        }
        return this.userRepository.find({
            where: {
                name: userSearchCriteria.name ? Like(`${userSearchCriteria.name}%`): Like('%'),
                email: userSearchCriteria.email ? Like(`${userSearchCriteria.email}%`): Like('%')
            },
            select: this.userSelectFilter
        });
    }

    async findOneWithPasswordByEmail(email: string): Promise<User| null> {
        return await this.userRepository.findOne({where : { email }});
    }

    async update(id: string, userRequestDto: UserCreateDto): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({id});
        const hash = await bcrypt.hash(userRequestDto.password, SALT_ROUNDS);
        userRequestDto.password = hash;
        const updatedUser: User = await this.userRepository.save({
            id: existingUser?.id,
            name: userRequestDto.name,
            email: userRequestDto.email,
            password: userRequestDto.password
        });
        delete updatedUser.password;
        return Promise.resolve(updatedUser);
    }

    async remove(id: string): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

}
