/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { json, urlencoded } from 'express';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const prisma = new PrismaClient();
  try {
    await prisma.welcomeMessage.upsert({
      where: { singleton: 'default' },
      update: {},
      create: {
        singleton: 'default',
        value: 'Hello',
      },
    });
    Logger.log(' Welcome message seeded');
  } finally {
    await prisma.$disconnect();
  }

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: process.env['CLIENT_URL'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
