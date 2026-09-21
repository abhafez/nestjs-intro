import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Paginated } from '../interfaces/paginated.interface';
import { calculateSkip } from '../utils/calculate-skip';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../app/config/app.constants';

/**
 * Runs paginated repository queries and wraps the rows in a {@link Paginated} envelope.
 *
 * Injecting {@link REQUEST} makes this provider — and everything depending on it —
 * request-scoped, which is what lets `links` be built from the incoming URL.
 */
@Injectable()
export class PaginationProvider {
  /**
   * Use Constructor to Inject Request
   * */
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  /**
   * Fetches one page of rows plus the navigation metadata for it.
   * @param paginationQuery page/limit taken from the query string
   * @param repository repository to read from
   * @param options extra TypeORM options (`where`, `relations`, `order`, …); `skip`/`take` are always overridden
   */
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
    options: Omit<FindManyOptions<T>, 'skip' | 'take'> = {},
  ): Promise<Paginated<T>> {
    const limit = paginationQuery.limit ?? DEFAULT_LIMIT;
    const page = paginationQuery.page ?? DEFAULT_PAGE;

    // findAndCount returns the rows and the total in one round-trip, and the total
    // respects `options.where` — a bare count() would report every row in the table.
    const [results, totalItems] = await repository.findAndCount({
      ...options,
      skip: calculateSkip(paginationQuery),
      take: limit,
    });

    /**
     * Create the request URLs
     */
    const baseURL = this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);

    // Calculate page numbers
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page >= totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;

    const pageUrl = (target: number) => `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${target}`;

    return {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: pageUrl(1),
        last: pageUrl(totalPages),
        current: pageUrl(page),
        next: pageUrl(nextPage),
        previous: pageUrl(previousPage),
      },
    };
  }
}
