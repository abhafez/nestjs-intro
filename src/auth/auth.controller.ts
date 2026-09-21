import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dto/signInDto';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';

/** Handles authentication routes. */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //#region POST /auth/sign-in
  /**
   * Logs a user in by email and password.
   * @param signInDto credentials submitted by the client
   */
  @ApiOperation({
    summary: 'Log in with email and password',
    description:
      'Looks the user up by email, then compares the supplied password against the stored bcrypt hash. ' +
      'No token is issued yet - a successful call returns `true`.',
  })
  @ApiBody({
    type: SignInDto,
    examples: {
      credentials: {
        summary: 'Email and password',
        value: { email: 'user@example.com', password: 'Str0ng!Passw0rd' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Credentials matched. Returns `true` until token issuing is implemented.',
    schema: { type: 'boolean', example: true },
  })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'The password does not match.', type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No user is registered with that email.', type: ApiErrorResponseDto })
  @ApiRequestTimeoutResponse({ description: 'The password comparison failed.', type: ApiErrorResponseDto })
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  login(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  //#endregion
}
