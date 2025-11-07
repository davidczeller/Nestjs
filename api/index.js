const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

let cachedApp;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  const { AppModule } = require('../dist/app.module.js');
  
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.init();
  cachedApp = app;
  
  return app;
}

module.exports = async (req, res) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
