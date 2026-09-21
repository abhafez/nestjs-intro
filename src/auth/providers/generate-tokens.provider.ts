import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../jwt.config';
import { type ConfigType } from '@nestjs/config';
import { User } from '../../users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * Signs the JWTs handed out at sign-in and on refresh.
 *
 * Both tokens are signed with the same secret, issuer and audience; only their TTL and payload
 * differ - the access token carries the user's email alongside `sub`, the refresh token carries
 * `sub` alone so a leaked refresh token discloses nothing about the account.
 */
@Injectable()
export class GenerateTokensProvider {
  /**
   * Creates the provider.
   * @param usersService user lookups
   * @param hashingProvider password hashing helpers
   * @param jwtService signs and verifies the tokens
   * @param jwtConfiguration secret, issuer, audience and the two TTLs
   */
  constructor(
    // Injecting UserService
    private readonly usersService: UsersService,
    /**
     * Inject the hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
    /** Inject JWT service */
    private readonly jwtService: JwtService,
    /** Inject JWT Config */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Signs one JWT.
   * @param userId value of the standard `sub` claim
   * @param expiresIn lifetime in seconds
   * @param payload extra claims merged next to `sub`
   * @returns the signed, encoded token
   */
  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const updatedPayload = {
      sub: userId,
      ...payload,
    };

    return await this.jwtService.signAsync(updatedPayload, {
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn,
      audience: this.jwtConfiguration.audience,
    });
  }

  /**
   * Signs an access/refresh pair for a user.
   * @param user the authenticated user
   * @returns `accessToken` (short-lived, carries `sub` and `email`) and `refreshToken` (long-lived, `sub` only)
   */
  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTTL, {
        email: user.email,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTTL),
    ]);

    return {
      accessToken,
      refreshToken,
    };
    // Generate access token
  }
}
