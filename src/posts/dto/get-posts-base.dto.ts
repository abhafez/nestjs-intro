import { IsDate, IsOptional } from 'class-validator';

/** Date-range filters shared by post listing queries. */
export class GetPostsBaseDto {
  /** Only include posts created on or after this date. */
  @IsOptional()
  @IsDate()
  startDate?: Date;

  /** Only include posts created on or before this date. */
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
