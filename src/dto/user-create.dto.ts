import { ApiProperty } from "@nestjs/swagger";
import { User } from "../model/user.entity";


export class UserCreateDto {
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    static toUserDto(createUserDto: UserCreateDto): User {
        const user: User = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        return user;
    }

}