/** Minimum allowed length for a user's first/last name. */
export const USER_NAME_MIN_LENGTH = 3;
/** Maximum allowed length for a user's first/last name. */
export const USER_NAME_MAX_LENGTH = 96;
/** Minimum allowed length for a user's password. */
export const USER_PASSWORD_MIN_LENGTH = 8;
/** Page used when a query omits `page`. */
export const DEFAULT_PAGE = 1;
/** Rows per page used when a query omits `limit`. */
export const DEFAULT_LIMIT = 10;
/** Request user key */
export const REQUEST_USER_KEY = 'user';
/** Metadata key holding the {@link AuthType} list set by the `@Auth` decorator. */
export const AUTH_TYPE_KEY = 'authType';
/**
 * Name of the bearer security scheme registered with Swagger in `main.ts`.
 *
 * `@ApiAuth()` references it so the "Authorize" button in Swagger UI feeds the token
 * to every protected route.
 */
export const ACCESS_TOKEN_SECURITY_SCHEME = 'access-token';
