import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import 'dotenv/config';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  app.setGlobalPrefix(process.env.ROUTE_PREFIX);

  // const cors = {
  //   origin: [
  //     'http://localhost:8100',
  //   ],
  //   methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   credentials: true,
  //   allowedHeaders: [
  //     'Accept',
  //     'Content-Type',
  //     'Authorization',
  //     'Access-Control-Allow-Origin'
  //   ]
  // };

  // app.enableCors(cors);

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(process.env.PORT);
  Logger.log(`Server running on http://localhost:${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
