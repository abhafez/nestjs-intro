import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../app/config/app.constants';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = DEFAULT_LIMIT;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = DEFAULT_PAGE;
}
