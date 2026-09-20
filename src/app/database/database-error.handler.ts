import { ConflictException, HttpException, RequestTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/** Postgres SQLSTATE codes that map onto a meaningful HTTP response. */
const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';
const NOT_NULL_VIOLATION = '23502';

/** Driver codes that mean the database was unreachable, not that the query was wrong. */
const CONNECTION_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EHOSTUNREACH',
  'EPIPE',
]);

/** Shape of the driver error TypeORM wraps inside {@link QueryFailedError}. */
type DriverError = { code?: string; detail?: string };

/**
 * Turns a repository failure into a meaningful HTTP exception so callers never see a bare 500.
 *
 * Exceptions we raised ourselves (`NotFoundException`, `ConflictException`, ...) pass straight
 * through, so wrapping a whole block in `try`/`catch` cannot swallow them.
 *
 * @param error the value thrown by the repository call
 * @param description what the caller was doing, used in the client-facing message
 * @throws HttpException always
 */
export function handleDatabaseError(error: unknown, description: string): never {
  // Never re-wrap a deliberate exception - it already carries the right status.
  if (error instanceof HttpException) {
    throw error;
  }

  const driverError: DriverError | undefined =
    error instanceof QueryFailedError ? (error.driverError as DriverError) : (error as DriverError);

  if (driverError?.code && CONNECTION_ERROR_CODES.has(driverError.code)) {
    throw new RequestTimeoutException(`Could not reach the database while ${description}, please try again later.`, {
      description: 'Database unreachable',
      cause: error,
    });
  }

  if (error instanceof QueryFailedError) {
    switch (driverError?.code) {
      case UNIQUE_VIOLATION:
        throw new ConflictException(`A record with the same unique value already exists while ${description}.`, {
          description: driverError.detail,
          cause: error,
        });
      case FOREIGN_KEY_VIOLATION:
        throw new ConflictException(`A related record is missing or still in use while ${description}.`, {
          description: driverError.detail,
          cause: error,
        });
      case NOT_NULL_VIOLATION:
        throw new ConflictException(`A required field was missing while ${description}.`, {
          description: driverError.detail,
          cause: error,
        });
    }
  }

  // Unknown failure: still a server-side problem, but reported as retryable rather than
  // leaking an internal stack trace as a 500.
  throw new ServiceUnavailableException(
    `Unable to complete the request while ${description}, please try again later.`,
    {
      description: 'Unexpected database error',
      cause: error,
    },
  );
}
