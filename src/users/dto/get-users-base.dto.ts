import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Non-pagination filters for user listing queries.
 *
 * Accepted but **not yet applied** to the query - see the API notes.
 */
export class GetUsersBaseDto {
  /** Exact email to match. */
  @ApiPropertyOptional({
    description: 'Only include users whose email matches this value. Not yet applied to the query.',
    example: 'user@example.com',
    type: String,
  })
  @IsOptional()
  @IsString()
  email?: string;
}
