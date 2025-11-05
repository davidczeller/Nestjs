// jwt:
// - secret: string
// - expiresIn: string

import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export interface AuthConfig {
  jwt: {
    secret: string;
    // expiresIn: string; // This won't work. Fails on typechecking.
    expiresIn: JwtSignOptions['expiresIn'];
  };
}

export const authConfig = registerAs<AuthConfig>(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn:
        (process.env.JWT_EXPIRES_IN as JwtSignOptions['expiresIn']) ?? '1h', // this todo
    },
  }),
);
