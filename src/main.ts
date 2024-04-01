import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { catchError, throwError, timeout } from 'rxjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors({
    intercept(context, next) {
      return next.handle().pipe(
        timeout(10000), // Defina o timeout para 10 segundos (10000 milissegundos)
        catchError(error => {
          if (error.name === 'TimeoutError') {
            // Se ocorrer um timeout, envie um erro 408 de volta para o cliente
            return throwError(new Error('Request Timeout'));
          }
          // Se ocorrer outro erro, repasse-o para o manipulador de erros padrão
          return throwError(error);
        }),
      );
    },
  });

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
