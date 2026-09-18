import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () =>
        new BadRequestException(
          I18nContext.current()?.t('errors.INVALID_NUMBER_ID') ??
            'Invalid input',
        ),
    });
  }
}
