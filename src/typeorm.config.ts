import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

// Use non-pooled connection for migrations (required for TypeORM)
// Pooled connections (pgbouncer) don't support some TypeORM features
const connectionUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

// Base configuration shared by both connection methods
const baseConfig = {
  type: 'postgres' as const,
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  ssl: {
    rejectUnauthorized: false,
  },
};

let dataSourceConfig: DataSourceOptions;

// Use connection URL if available, otherwise use individual parameters
if (connectionUrl) {
  dataSourceConfig = {
    ...baseConfig,
    url: connectionUrl,
  };
} else {
  dataSourceConfig = {
    ...baseConfig,
    host: process.env.DB_HOST || process.env.POSTGRES_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER || process.env.POSTGRES_USER,
    password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
    database: process.env.DB_DATABASE || process.env.POSTGRES_DATABASE,
  };
}

export default new DataSource(dataSourceConfig);
