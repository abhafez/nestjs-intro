import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../app/config/app.constants';

/**
 * Translates a pagination query into TypeORM's `skip` offset.
 * @param query pagination params; missing values fall back to {@link DEFAULT_PAGE}/{@link DEFAULT_LIMIT}
 * @returns number of rows to skip, never negative
 */
export function calculateSkip(query: PaginationQueryDto): number {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;

  return (page - 1) * limit;
}
