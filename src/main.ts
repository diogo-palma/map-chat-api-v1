import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const staticPath = '/public';
  app.enableCors({
    origin: [process.env.ALLOWED_ORIGIN, process.env.ALLOWED_ORIGIN_DEV],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });
  app.use(staticPath, function (req, res, next) {
    if ('POST' != req.method) {
      next()
    } else {
      req.method = 'GET'
      next()
    }
  })
  app.use(staticPath, express.static(join(__dirname, '..', 'public')))

  await app.listen(3000);
}
bootstrap();
