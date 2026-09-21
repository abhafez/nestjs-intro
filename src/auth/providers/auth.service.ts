import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import SignInProvider from './sign-in.provider';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import RefreshTokensProvider from './refresh-tokens.provider';

/** Authentication logic, kept separate from `UsersService` to avoid a circular module dependency. */
@Injectable()
export class AuthService {
  /**
   * Creates the service.
   * @param signInProvider verifies credentials and issues the first token pair
   * @param refreshTokensProvider trades a valid refresh token for a new pair
   */
  constructor(
    /** Verifies credentials and issues the first token pair. */
    private readonly signInProvider: SignInProvider,

    /** Trades a valid refresh token for a new pair. */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  //#region signIn
  /**
   * Logs a user in and issues a token pair.
   * @param signInDto the submitted email and password
   * @returns an `accessToken`/`refreshToken` pair
   * @throws NotFoundException when no user has that email
   * @throws UnauthorizedException when the password does not match
   * @throws RequestTimeoutException when the hash comparison fails
   */
  async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
  //#endregion

  //#region refresh tokens
  /**
   * Issues a fresh token pair from a still-valid refresh token.
   * @param refreshTokenDto the refresh token handed out at sign-in
   * @returns a new `accessToken`/`refreshToken` pair
   * @throws UnauthorizedException when the refresh token is expired, malformed or foreign
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshToken(refreshTokenDto);
  }
  //#endregion
}
