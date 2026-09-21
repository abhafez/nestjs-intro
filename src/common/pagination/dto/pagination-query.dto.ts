import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../app/config/app.constants';

/** Page size and page number accepted by every list endpoint. */
export class PaginationQueryDto {
  /** Rows per page. */
  @ApiPropertyOptional({
    description: 'Rows per page. Must be a positive integer.',
    example: 10,
    default: DEFAULT_LIMIT,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = DEFAULT_LIMIT;

  /** Page number, 1-based. */
  @ApiPropertyOptional({
    description: 'Page number, 1-based. Must be a positive integer.',
    example: 1,
    default: DEFAULT_PAGE,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = DEFAULT_PAGE;
}
