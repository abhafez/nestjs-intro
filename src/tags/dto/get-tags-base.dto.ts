import { IsDate, IsOptional } from 'class-validator';

/** Date-range filters shared by tag listing queries. */
export class GetTagsBaseDto {
  /** Only include tags created on or after this date. */
  @IsOptional()
  @IsDate()
  startDate?: Date;

  /** Only include tags created on or before this date. */
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
