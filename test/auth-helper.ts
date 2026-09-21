import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../src/auth/jwt.config';

/**
 * Signs an access token valid for the running app, so a spec can reach a protected route.
 *
 * Uses the app's own `JwtService` and jwt config, which means the token is verified by the
 * real `AccessTokenGuard` rather than bypassing it.
 */
export async function signTestToken(app: INestApplication): Promise<string> {
  const jwtService = app.get(JwtService);
  const config = app.get<ConfigType<typeof jwtConfig>>(jwtConfig.KEY);

  return jwtService.signAsync(
    { sub: 1, email: 'e2e@example.com' },
    {
      secret: config.secret,
      audience: config.audience,
      issuer: config.issuer,
      expiresIn: config.accessTokenTTL,
    },
  );
}
