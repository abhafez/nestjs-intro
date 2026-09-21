import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
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
import { AppService } from './providers/app.service';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';
import { formatValidationErrors } from './i18n/format-validation-errors';
import { AppEntities } from './app.entities';
import { MetaOptionModule } from '../meta-option/meta-option.module';
import { TagsModule } from '../tags/tags.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/enviroment.validation';
import { PaginationModule } from '../common/pagination/pagination.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../auth/jwt.config';
import { AuthenticationGuard } from '../auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';

/** Current `NODE_ENV`, used to pick which `.env.*` file the config module loads. */
const ENV = process.env.NODE_ENV;

/**
 * Env files to read, highest precedence first.
 *
 * The environment-specific file wins where it defines a value, and `.env` fills in the rest.
 * The fallback matters under Jest, which sets `NODE_ENV=test` on its own: without it, a missing
 * `.env.test` means nothing is loaded at all and every `required()` in the schema fails at boot.
 */
const ENV_FILE_PATH = ENV ? [`.env.${ENV}`, '.env'] : ['.env'];

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        exceptionFactory: i18nValidationErrorFactory,
      }),
    },
    { provide: APP_FILTER, useValue: new I18nValidationExceptionFilter({ errorFormatter: formatValidationErrors }) },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        synchronize: configService.get('database.synchronize'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        database: configService.get('database.name'),
        entities: AppEntities,
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
      resolvers: [AcceptLanguageResolver],
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    AuthModule,
    MetaOptionModule,
    PostsModule,
    PaginationModule,
    TagsModule,
    UsersModule,
  ],
})
export class AppModule {}
