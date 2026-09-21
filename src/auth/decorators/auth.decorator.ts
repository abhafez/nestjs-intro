import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../app/config/app.constants';

/**
 * Declares which authentication strategies a route (or a whole controller) accepts.
 *
 * Without it a route falls back to {@link AuthType.Bearer}, so everything is protected
 * by default. Mark a public route with `@Auth(AuthType.None)`.
 *
 * @param authTypes the strategies to accept; the first one decides the default behaviour
 */
export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
