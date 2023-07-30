import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user/user.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly userService: UserService) {}

  async onApplicationBootstrap() {
    const result = await this.userService.findOneWithPasswordByEmail('admin@testing.com');
    if (result === null) {
      const userCreateDto: UserCreateDto = {
        name: 'admin',
        email: 'admin@testing.com',
        password: 'testing'
      }
      try {
        const user = await this.userService.createUser(userCreateDto);
        if (user) {
          this.logger.log('***Default user is generated, please check README.md for your credential***');
        }
      } catch (error) {
        console.error(error);  
      }
    } else {
      this.logger.log('***Default user is already created, please check README.md for your credential***')
    }
    
  }
}
