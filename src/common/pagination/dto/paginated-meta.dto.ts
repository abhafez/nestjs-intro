import { ApiProperty } from '@nestjs/swagger';

/** Page counters returned alongside every paginated payload. */
export class PaginatedMetaDto {
  /** Rows requested per page. */
  @ApiProperty({ description: 'Rows requested per page.', example: 10 })
  itemsPerPage: number;

  /** Total rows matching the query, across every page. */
  @ApiProperty({ description: 'Total rows matching the query, across every page.', example: 42 })
  totalItems: number;

  /** Page that was returned, 1-based. */
  @ApiProperty({ description: 'Page that was returned, 1-based.', example: 1 })
  currentPage: number;

  /** Number of pages available at this page size. */
  @ApiProperty({ description: 'Number of pages available at this page size.', example: 5 })
  totalPages: number;
}
