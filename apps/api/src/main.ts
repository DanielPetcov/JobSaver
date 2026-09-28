import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './database/data-source';
import { seedDevelopmentUser } from './database/seed';

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await seedDevelopmentUser(AppDataSource);
  await AppDataSource.destroy();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(Number(process.env.API_PORT ?? 3001), '0.0.0.0');
}

void bootstrap();

