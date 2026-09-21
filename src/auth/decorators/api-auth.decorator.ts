import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto';
import { ACCESS_TOKEN_SECURITY_SCHEME } from '../../app/config/app.constants';

/**
 * Documents a route as requiring a bearer access token.
 *
 * `AuthenticationGuard` protects every route that does not opt out with `@Auth(AuthType.None)`,
 * but the guard is invisible to OpenAPI. This pairs the security requirement with the `401` the
 * guard throws, so the lock icon and the failure case stay in sync on every protected route.
 *
 * Apply it to a controller to cover all of its routes, or to a single route when the controller
 * also serves public ones.
 *
 * @see ACCESS_TOKEN_SECURITY_SCHEME for the scheme registered in `main.ts`
 */
export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(ACCESS_TOKEN_SECURITY_SCHEME),
    ApiUnauthorizedResponse({
      description: 'The `Authorization` header is missing, malformed, or carries an expired or invalid token.',
      type: ApiErrorResponseDto,
    }),
  );
}
