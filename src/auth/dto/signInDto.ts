import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/** Credentials submitted to `POST /auth/sign-in`. */
export class SignInDto {
  /** User's email address. */
  @ApiProperty({
    description: 'Email address the account was registered with.',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  email: string;

  /** User's password. */
  @ApiProperty({
    description: 'Plaintext password; compared against the stored bcrypt hash.',
    example: 'Str0ng!Passw0rd',
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
