import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../dto/auth.dto';
import { User } from '../model/user.entity';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
                private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User> {
      const user = await this.userService.findOneWithPasswordByEmail(email);
      if (user && user.password) {
        const hashResult = await bcrypt.compare(password, user.password);
        if (hashResult) {
            const { password, ...result } = user;
            return result;
        }
      }
      throw new UnauthorizedException();
    }

    async login(authDto: AuthDto) {
        const user = await this.validateUser(authDto.email, authDto.password);
        if (user) {
            const payload = { username: user.email, sub: user.id };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        }
      }
}
