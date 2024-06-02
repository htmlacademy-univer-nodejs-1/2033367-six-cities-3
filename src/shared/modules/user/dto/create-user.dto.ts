import { IsEmail, IsEnum, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { CreateUserValidationMessage } from './create-user.messages.js';

export class CreateUserDTO {

  @IsString({ message: CreateUserValidationMessage.name.invalidFormat })
  @MinLength(1, { message: CreateUserValidationMessage.name.minLength })
  @MaxLength(15, { message: CreateUserValidationMessage.name.maxLength })
  public name: string;

  @IsEmail({}, { message: CreateUserValidationMessage.email.invalidFormat })
  public email: string;

  @IsEnum(UserType, { message: CreateUserValidationMessage.userType.invalid })
  public userType: UserType;

  @IsString({ message: CreateUserValidationMessage.password.invalidFormat })
  @Length(6, 12, { message: CreateUserValidationMessage.password.length })
  public password: string;

}
