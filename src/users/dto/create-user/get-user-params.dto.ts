import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/** Route params for looking up a single user. */
export class GetUserParamsDto {
  /** Id of the user to fetch. */
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.ID_MUST_BE_NUMERIC') })
  id?: number;
}
