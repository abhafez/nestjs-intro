import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
      resolvers: [AcceptLanguageResolver],
    }),
    AuthModule,
    PostsModule,
    UsersModule,
  ],
})
export class AppModule {}
