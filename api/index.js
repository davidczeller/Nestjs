const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  const server = await bootstrap();
  return server.getHttpAdapter().getInstance()(req, res);
};

