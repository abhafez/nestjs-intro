import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
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
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

/** Handles authentication routes. */
@ApiTags('Auth')
@Auth(AuthType.None)
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
      'On a match it returns a freshly signed token pair: a short-lived `accessToken` for the ' +
      '`Authorization` header, and a long-lived `refreshToken` to redeem at `POST /auth/refresh-tokens`.',
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
    description: 'Credentials matched. Carries the newly issued token pair.',
    schema: {
      type: 'object',
      required: ['accessToken', 'refreshToken'],
      properties: {
        accessToken: {
          type: 'string',
          description: 'Send as `Authorization: Bearer <accessToken>` on every protected route.',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSJ9...',
        },
        refreshToken: {
          type: 'string',
          description: 'Redeem at `POST /auth/refresh-tokens` once the access token expires.',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9...',
        },
      },
    },
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

  //#region POST /auth/refresh-tokens
  /**
   * Exchanges a refresh token for a fresh pair of tokens.
   * @param refreshTokenDto the refresh token previously issued at sign-in
   */
  @ApiOperation({
    summary: 'Refresh an expired access token',
    description:
      'Public - it authenticates with the refresh token in the body rather than an `Authorization` header, ' +
      'so an expired access token is not an obstacle. The token is verified, the user it names is re-read ' +
      'from the database, and a brand new pair is issued.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      refresh: {
        summary: 'A previously issued refresh token',
        value: { refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiOkResponse({
    description: 'A newly issued token pair, same shape as `POST /auth/sign-in`.',
    schema: {
      type: 'object',
      required: ['accessToken', 'refreshToken'],
      properties: {
        accessToken: { type: 'string', description: 'The replacement access token.' },
        refreshToken: { type: 'string', description: 'The replacement refresh token.' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiUnauthorizedResponse({
    description: 'The refresh token is expired, malformed or was not issued by this API.',
    type: ApiErrorResponseDto,
  })
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
  //#endregion
}
