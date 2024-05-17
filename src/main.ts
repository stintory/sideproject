import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';
import * as process from 'process';
import * as express from 'express';
import * as path from 'path';
import { winstonLogger } from './@common/middlewares/winston.logger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // 쿼리 매개변수 변환 활성화
      },
    }),
  );
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  if (process.env.MODE === 'dev') {
    app.setViewEngine('ejs');
  }

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setViewEngine('ejs');

  const config = new DocumentBuilder()
    .setTitle('Developer API')
    .setDescription('Developer 개발을 위한 API 문서입니다.')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3005');
  const configV1 = config.setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, configV1, {
    include: [AppModule],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs/v1', app, document, {
    swaggerOptions: {
      docExpansion: 'list', // 문서 초기 표시 방법 'list', 'full', 'none'
      operationSorter: 'alpha', // alpha(알파벳 순서), method(HTTP 메소드 순서), false(정렬수행 안함)
      filter: true,
      showRequestDuration: true,
    },
  });
  /** Cors */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(express.static(path.join(__dirname, '..', 'views')));

  const PORT = process.env.PORT;
  console.log(PORT);
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
