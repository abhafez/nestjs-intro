import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, TranslateOptions } from 'nestjs-i18n';

export function i18nException(key: string, status: HttpStatus = HttpStatus.BAD_REQUEST, options?: TranslateOptions) {
  return () => new HttpException(I18nContext.current()?.t(key, options) ?? key, status);
}
