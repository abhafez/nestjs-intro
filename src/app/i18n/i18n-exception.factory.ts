import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, TranslateOptions } from 'nestjs-i18n';

/**
 * Builds a factory that throws an {@link HttpException} whose message is
 * translated via the current {@link I18nContext} at call time.
 * @param key i18n translation key
 * @param status HTTP status code for the thrown exception
 * @param options translation options passed to `I18nContext#t`
 * @returns a zero-arg function that creates the exception
 */
export function i18nException(key: string, status: HttpStatus = HttpStatus.BAD_REQUEST, options?: TranslateOptions) {
  return () => new HttpException(I18nContext.current()?.t(key, options) ?? key, status);
}
