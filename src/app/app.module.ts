import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { formatValidationErrors } from './i18n/format-validation-errors';
import { AppEntities } from './app.entities';
import { MetaOptionModule } from '../meta-option/meta-option.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true, exceptionFactory: i18nValidationErrorFactory }),
    },
    { provide: APP_FILTER, useValue: new I18nValidationExceptionFilter({ errorFormatter: formatValidationErrors }) },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: AppEntities,
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
      resolvers: [AcceptLanguageResolver],
    }),
    AuthModule,
    PostsModule,
    UsersModule,
    MetaOptionModule,
    TagsModule,
  ],
})
export class AppModule {}
