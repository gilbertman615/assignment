import { HttpException, HttpStatus } from "@nestjs/common";
import { UserCreateDto } from "src/dto/user-create.dto";
import { INVALID_EMAIL_MESSAGE, INVALID_PASSWORD_MESSAGE } from "../../constant";
import { RegexValidation } from "./regex.validation";

export class UserValidation {

    static isValidRequest(userCreateDto: UserCreateDto): void {
        const requiredFields: (keyof UserCreateDto)[] = ['name', 'email', 'password'];
        const missingSet: Set<string> = new Set();

        requiredFields.forEach(requiredField => {
            if (!userCreateDto[requiredField]) {
                missingSet.add(requiredField);
            }
        });

        if (missingSet.size > 0) {
            throw new HttpException(`Missing property: ${Array.from(missingSet.values())}`, HttpStatus.BAD_REQUEST);
        }

        if (!RegexValidation.isValidEmail(userCreateDto.email)) {
            throw new HttpException(INVALID_EMAIL_MESSAGE, HttpStatus.BAD_REQUEST);
        }
        if (!RegexValidation.isValidPassword(userCreateDto.password)) {
            throw new HttpException(INVALID_PASSWORD_MESSAGE, HttpStatus.BAD_REQUEST);
        }
    }
}