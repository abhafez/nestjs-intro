import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import {
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../../app/config/app.constants';

/** Payload for creating a user. */
export class CreateUserDto {
  //#region firstName
  /** User's first name. */
  @ApiProperty({
    description: "User's first name.",
    example: 'Abdurrahman',
    minLength: USER_NAME_MIN_LENGTH,
    maxLength: USER_NAME_MAX_LENGTH,
  })
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
  /** User's last name. */
  @ApiPropertyOptional({
    description: "User's last name.",
    example: 'Hafez',
    minLength: USER_NAME_MIN_LENGTH,
    maxLength: USER_NAME_MAX_LENGTH,
  })
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
  /** User's email address. */
  @ApiProperty({
    description: 'Email address, used to log in. Must not already be registered.',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  email: string;
  //#endregion

  //#region password
  /** User's password; must contain lowercase, uppercase, a number, and a special character. */
  @ApiProperty({
    description:
      'Password. Must contain a lowercase letter, an uppercase letter, a number and a special character. ' +
      'Stored as a bcrypt hash, never in plaintext.',
    example: 'Str0ng!Passw0rd',
    format: 'password',
    minLength: USER_PASSWORD_MIN_LENGTH,
  })
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
