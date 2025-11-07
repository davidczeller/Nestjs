import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    // Prefer connection URL (for Vercel/Neon), fallback to individual params
    const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (connectionUrl) {
      return {
        type: 'postgres',
        url: connectionUrl,
        // only use in development mode! It will drop the database columns and tables!
        synchronize: Boolean(process.env.DB_SYNC ?? false),
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          // Increase connection pool for better performance with Neon
          max: 10,
        },
      };
    }

    // Fallback to individual connection parameters
    return {
      type: 'postgres',
      host: process.env.DB_HOST || process.env.POSTGRES_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER || process.env.POSTGRES_USER,
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
      database: process.env.DB_DATABASE || process.env.POSTGRES_DATABASE,
      // only use in development mode! It will drop the database columns and tables!
      synchronize: Boolean(process.env.DB_SYNC ?? false),
      ssl: {
        rejectUnauthorized: false,
      },
    };
  },
);
