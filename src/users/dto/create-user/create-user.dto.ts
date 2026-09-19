import { i18nValidationMessage } from 'nestjs-i18n';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import {
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../../app/config/app.constants';

export class CreateUserDto {
  //#region firstName
  @IsString({ message: i18nValidationMessage('validation.NAME_MIN_LENGTH', { min: USER_NAME_MIN_LENGTH }) })
  @MinLength(USER_NAME_MIN_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MIN_LENGTH', { min: USER_NAME_MIN_LENGTH }),
  })
  @MaxLength(USER_NAME_MAX_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MAX_LENGTH', { max: USER_NAME_MAX_LENGTH }),
  })
  firstName: string;
  //#endregion

  //#region lastName
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.NAME_MIN_LENGTH', { min: USER_NAME_MIN_LENGTH }) })
  @MinLength(USER_NAME_MIN_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MIN_LENGTH', { min: USER_NAME_MIN_LENGTH }),
  })
  @MaxLength(USER_NAME_MAX_LENGTH, {
    message: i18nValidationMessage('validation.NAME_MAX_LENGTH', { max: USER_NAME_MAX_LENGTH }),
  })
  lastName?: string;
  //#endregion

  //#region email
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  email: string;
  //#endregion

  //#region password
  @IsString({ message: i18nValidationMessage('validation.PASSWORD_IS_REQUIRED') })
  @MinLength(USER_PASSWORD_MIN_LENGTH, {
    message: i18nValidationMessage('validation.PASSWORD_MIN_LENGTH', { min: USER_PASSWORD_MIN_LENGTH }),
  })
  @Matches(/[a-z]/, { message: i18nValidationMessage('validation.PASSWORD_LOWERCASE') })
  @Matches(/[A-Z]/, { message: i18nValidationMessage('validation.PASSWORD_UPPERCASE') })
  @Matches(/[0-9]/, { message: i18nValidationMessage('validation.PASSWORD_NUMBER') })
  @Matches(/[^A-Za-z0-9]/, { message: i18nValidationMessage('validation.PASSWORD_SPECIAL') })
  password: string;
  //#endregion
}
