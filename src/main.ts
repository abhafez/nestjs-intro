import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ACCESS_TOKEN_SECURITY_SCHEME } from './app/config/app.constants';

/** Creates the Nest application, mounts Swagger at `/api`, and starts listening. */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const SwaggerConfig = new DocumentBuilder()
    .setTitle('My Nest App')
    .setDescription(
      [
        'Blog API covering posts, tags, meta options and users.',
        '',
        '**Pagination.** Every list endpoint accepts `limit` and `page` and answers with the same envelope:',
        '`data` (the rows), `meta` (page counters) and `links` (ready-made URLs for first/last/current/next/previous).',
        'Defaults are `limit=10`, `page=1`.',
        '',
        '**Languages.** Validation errors and success messages are translated through `nestjs-i18n`.',
        'Send `Accept-Language: ar` for Arabic; anything else falls back to English.',
        '',
        '**Errors.** Validation failures return `400` with one entry per invalid field. Database failures are',
        'mapped to `409` (constraint violation), `408` (unreachable) or `503` (anything else) rather than a bare `500`.',
        '',
        '**Authentication.** Every route is protected by default. Sign in through `POST /auth/sign-in`, then press',
        '**Authorize** and paste the returned `accessToken` - Swagger UI sends it as `Authorization: Bearer <token>`',
        'on every request from then on. Routes without a lock icon accept anonymous callers.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description:
          'Access token issued by `POST /auth/sign-in`. Paste the raw token; the `Bearer ` prefix is added for you.',
      },
      ACCESS_TOKEN_SECURITY_SCHEME,
    )
    .addServer('http://localhost:3000', 'Local development')
    .addTag('App', 'Health check.')
    .addTag('Auth', 'Sign-in and token refresh. The only public routes in the API.')
    .addTag('Users', 'User accounts and bulk creation.')
    .addTag('Posts', 'Blog posts, their tags and meta options.')
    .addTag('Tags', 'Tags that can be attached to posts, with soft delete.')
    .addTag('Meta Options', 'Arbitrary JSON metadata attached to posts.')
    .build();
  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
