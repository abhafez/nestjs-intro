import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_TOKEN,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    accessTokenTTL: parseInt(process.env.JWT_TOKEN_TTL ?? '3600', 10),
  };
});
