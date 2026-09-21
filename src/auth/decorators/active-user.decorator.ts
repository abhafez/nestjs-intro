import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../app/config/app.constants';

/**
 * Reads the authenticated user off the request, where `AccessTokenGuard` stored it.
 *
 * Pass a field name to receive just that value: `@ActiveUser('sub') userId: number`.
 * Omit it to receive the whole {@link ActiveUserData} payload.
 *
 * Returns `undefined` on a route marked `@Auth(AuthType.None)`, since no token was verified.
 */
export const ActiveUser = createParamDecorator((field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];

  return field ? user?.[field] : user;
});
