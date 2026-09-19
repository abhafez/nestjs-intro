import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/** Credentials submitted to `POST /auth/login`. */
export class LoginDto {
  /** User's email address. */
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  email: string;

  /** User's password. */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
