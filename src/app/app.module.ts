import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { formatValidationErrors } from './i18n/format-validation-errors';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
      resolvers: [AcceptLanguageResolver],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true, exceptionFactory: i18nValidationErrorFactory }),
    },
    { provide: APP_FILTER, useValue: new I18nValidationExceptionFilter({ errorFormatter: formatValidationErrors }) },
  ],
})
export class AppModule {}
