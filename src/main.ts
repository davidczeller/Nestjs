import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true, production mode
      // disableErrorMessages: true, production mode
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
