import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../jwt.config';
import { type ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * Trades a valid refresh token for a fresh token pair.
 *
 * The refresh token only carries `sub`, so the user is re-read from the database on every
 * refresh - a deleted account cannot keep renewing its session.
 */
@Injectable()
class RefreshTokensProvider {
  /**
   * Creates the provider.
   * @param userService re-reads the user named by the token's `sub` claim
   * @param generateTokensProvider signs the replacement pair
   * @param jwtService verifies the incoming refresh token
   * @param jwtConfiguration secret, issuer and audience the token is checked against
   */
  constructor(
    /** Inject user service */
    private readonly userService: UsersService,
    /** Inject generate tokens provider */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /** Inject JWT service */
    private readonly jwtService: JwtService,
    /** Inject JWT Config */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Verifies a refresh token and issues a replacement pair.
   * @param refreshTokenDto the refresh token to redeem
   * @returns a new `accessToken`/`refreshToken` pair
   * @throws UnauthorizedException when the token fails verification or its user no longer exists
   */
  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.userService.findOneById(sub);

      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

export default RefreshTokensProvider;
