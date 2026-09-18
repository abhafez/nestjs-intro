import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { USER_NAME_MAX_LENGTH, USER_NAME_MIN_LENGTH } from '../../../app/config/app.constants';

export class CreateUserDto {
  @IsString()
  @MinLength(USER_NAME_MIN_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MIN_LENGTH', { min: USER_NAME_MIN_LENGTH }),
  })
  @MaxLength(USER_NAME_MAX_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MAX_LENGTH', { max: USER_NAME_MAX_LENGTH }),
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(USER_NAME_MIN_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MIN_LENGTH', { min: USER_NAME_MIN_LENGTH }),
  })
  @MaxLength(USER_NAME_MAX_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MAX_LENGTH', { max: USER_NAME_MAX_LENGTH }),
  })
  lastName: string;

  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.EMAIL_REQUIRED') })
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
