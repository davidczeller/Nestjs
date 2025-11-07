import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import * as Joi from 'joi';
import { AuthConfig } from './auth.config';

export interface ConfigType {
  app: AppConfig;
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
}

export const appConfigSchema = Joi.object({
  APP_MESSAGE_PREFIX: Joi.string().default('Something is wrong in config'),

  // Vercel/Neon connection URL (preferred)
  POSTGRES_URL: Joi.string().uri().optional(),
  DATABASE_URL: Joi.string().uri().optional(),
  POSTGRES_URL_NON_POOLING: Joi.string().uri().optional(),
  DATABASE_URL_UNPOOLED: Joi.string().uri().optional(),

  // Individual database parameters (fallback)
  DB_HOST: Joi.string().optional(),
  POSTGRES_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().optional(),
  POSTGRES_USER: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  POSTGRES_PASSWORD: Joi.string().optional(),
  DB_DATABASE: Joi.string().optional(),
  POSTGRES_DATABASE: Joi.string().optional(),

  DB_SYNC: Joi.alternatives()
    .try(
      Joi.boolean(),
      Joi.number().valid(0, 1),
      Joi.string().valid('true', 'false', '0', '1'),
    )
    .default(false),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  // Other Vercel/Neon variables (optional, for documentation)
  PGHOST: Joi.string().optional(),
  PGHOST_UNPOOLED: Joi.string().optional(),
  PGUSER: Joi.string().optional(),
  PGDATABASE: Joi.string().optional(),
  PGPASSWORD: Joi.string().optional(),
  POSTGRES_URL_NO_SSL: Joi.string().uri().optional(),
  POSTGRES_PRISMA_URL: Joi.string().uri().optional(),
})
  .or('POSTGRES_URL', 'DATABASE_URL', 'DB_HOST', 'POSTGRES_HOST')
  .messages({
    'object.missing':
      'Either POSTGRES_URL/DATABASE_URL or DB_HOST/POSTGRES_HOST must be provided',
  });
