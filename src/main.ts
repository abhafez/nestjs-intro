import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { I18nValidationExceptionFilter, i18nValidationErrorFactory } from 'nestjs-i18n';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }));
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
