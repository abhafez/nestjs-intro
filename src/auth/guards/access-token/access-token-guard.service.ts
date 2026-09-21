import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../jwt.config';
import { type ConfigType } from '@nestjs/config';
import { type Request } from 'express';
import { REQUEST_USER_KEY } from '../../../app/config/app.constants';

/**
 * Verifies the `Authorization: Bearer <token>` header and attaches the decoded payload
 * to the request under {@link REQUEST_USER_KEY}.
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  /**
   * Creates the guard.
   * @param jwtService verifies and decodes the token
   * @param jwtConfiguration secret, audience and issuer the token is checked against
   */
  constructor(
    /** Inject JWT service */
    private readonly jwtService: JwtService,

    /** Inject JWT Config */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  /**
   * Accepts the request when it carries a valid bearer token.
   * @param context the current execution context
   * @returns `true` when the token verifies
   * @throws UnauthorizedException when the header is missing or the token is invalid
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request[REQUEST_USER_KEY] = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * Pulls the token out of the `Authorization` header.
   * @param request the incoming request
   * @returns the token, or `undefined` when the header is absent or malformed
   */
  private extractRequestFromHeader(request: Request) {
    const [_, token] = request?.headers?.authorization?.split(' ') ?? [];
    return token;
  }
}
