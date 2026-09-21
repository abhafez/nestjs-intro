import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import SignInProvider from './providers/sign-in.provider';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import RefreshTokensProvider from './providers/refresh-tokens.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';

/**
 * Sign-in, token issuing and the guards that read those tokens back.
 *
 * Kept apart from `UsersModule` - each needs the other, so the pair is wired with
 * `forwardRef` and the password hashing lives here rather than on the user side.
 */
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SignInProvider,
    RefreshTokensProvider,
    GenerateTokensProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    AccessTokenGuard,
    AuthenticationGuard,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider, AccessTokenGuard, AuthenticationGuard, JwtModule, ConfigModule],
})
export class AuthModule {}
