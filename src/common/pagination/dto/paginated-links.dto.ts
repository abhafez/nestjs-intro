import { ApiProperty } from '@nestjs/swagger';

/** Ready-made URLs for navigating a paginated collection. */
export class PaginatedLinksDto {
  /** First page. */
  @ApiProperty({ description: 'First page.', example: 'http://localhost:3000/posts?limit=10&page=1' })
  first: string;

  /** Last page at this page size. */
  @ApiProperty({ description: 'Last page at this page size.', example: 'http://localhost:3000/posts?limit=10&page=5' })
  last: string;

  /** The page that was returned. */
  @ApiProperty({ description: 'The page that was returned.', example: 'http://localhost:3000/posts?limit=10&page=1' })
  current: string;

  /** Next page; equals `current` on the last page. */
  @ApiProperty({
    description: 'Next page; equals `current` on the last page.',
    example: 'http://localhost:3000/posts?limit=10&page=2',
  })
  next: string;

  /** Previous page; equals `current` on the first page. */
  @ApiProperty({
    description: 'Previous page; equals `current` on the first page.',
    example: 'http://localhost:3000/posts?limit=10&page=1',
  })
  previous: string;
}
