import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token-guard.service';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../../app/config/app.constants';

/**
 * Global guard that dispatches to the right strategy for each route.
 *
 * Routes are protected unless they opt out with `@Auth(AuthType.None)`, so forgetting the
 * decorator fails closed rather than exposing an endpoint.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /** Strategy applied when a route carries no `@Auth` decorator. */
  private static readonly defaultAuthType = AuthType.Bearer;

  /** The guard backing each {@link AuthType}. `None` always passes. */
  private readonly authTypeGuardMap: Record<AuthType, CanActivate>;

  /**
   * Creates the guard.
   * @param reflector reads the `@Auth` metadata off the handler and its controller
   * @param accessTokenGuard the guard backing {@link AuthType.Bearer}
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  /**
   * Runs the guards for the route's declared auth types, accepting the first that passes.
   * @param context the current execution context
   * @returns `true` when one of the strategies accepts the request
   * @throws UnauthorizedException when every strategy rejects it
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Handler metadata wins over controller metadata, so a single route can opt out.
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    let error = new UnauthorizedException();

    for (const type of authTypes) {
      const guard = this.authTypeGuardMap[type];

      try {
        if (await guard.canActivate(context)) {
          return true;
        }
      } catch (caught) {
        error = caught as UnauthorizedException;
      }
    }

    throw error;
  }
}
