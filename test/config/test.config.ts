export const testConfig = {
  database: {
    type: 'postgres',
    host: 'localhost',
    port: '5433',
    username: 'postgres',
    password: 'postgres',
    database: 'tasks_e2e',
    synchronize: true,
  },
  app: {
    messagePrefix: '',
  },
  auth: {
    jwt: {
      secret: 'test-secret',
      expiresIn: '1m',
    },
  },
};
