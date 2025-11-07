import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Application } from 'express';

// Lazy load express to avoid initialization issues
let app: Application | null = null;

async function bootstrap(): Promise<Application> {
  const express = (await import('express')).default;
  const server = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await nestApp.init();
  return server;
}

export default async (req: Request, res: Response): Promise<void> => {
  if (!app) {
    app = await bootstrap();
  }
  app(req, res, () => {});
};
