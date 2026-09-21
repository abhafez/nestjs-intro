import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

/**
 * Date-range filters shared by tags listing queries.
 *
 * Accepted but **not yet applied** to the query - see the API notes.
 */
export class GetTagsBaseDto {
  /** Lower bound of the creation date range. */
  @ApiPropertyOptional({
    description: 'Only include tags created on or after this date. Not yet applied to the query.',
    example: '2026-09-01T00:00:00.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  /** Upper bound of the creation date range. */
  @ApiPropertyOptional({
    description: 'Only include tags created on or before this date. Not yet applied to the query.',
    example: '2026-09-30T23:59:59.000Z',
    format: 'date-time',
    type: String,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
