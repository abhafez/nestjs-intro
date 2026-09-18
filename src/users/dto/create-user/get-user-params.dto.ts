import { IsInt, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetUserParamsDto {
  @IsString({ message: i18nValidationMessage('validation.ID_MUST_BE_NUMERIC') })
  @IsInt({ message: i18nValidationMessage('validation.ID_MUST_BE_NUMERIC') })
  id?: number;
}
