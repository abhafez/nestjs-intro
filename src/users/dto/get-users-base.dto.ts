import { IsOptional, IsString } from 'class-validator';

/** Non-pagination filters for user listing queries. */
export class GetUsersBaseDto {
  /** Only include users whose email matches this value. */
  @IsOptional()
  @IsString()
  email?: string;
}
