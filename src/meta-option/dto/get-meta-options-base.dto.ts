import { IsDate, IsOptional } from 'class-validator';

/** Date-range filters shared by meta option listing queries. */
export class GetMetaOptionsBaseDto {
  /** Only include meta options created on or after this date. */
  @IsOptional()
  @IsDate()
  startDate?: Date;

  /** Only include meta options created on or before this date. */
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
