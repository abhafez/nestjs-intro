import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetUserParamsDto {
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.ID_MUST_BE_NUMERIC') })
  id?: number;
}
