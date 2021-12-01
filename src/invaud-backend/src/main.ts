import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.setGlobalPrefix('api/');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = new DocumentBuilder()
      .setTitle('Invoice & Audit Module')
      .setDescription('Invoice & Audit Module API description')
      .setVersion('0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3030);
  } catch (err) {
    Logger.error(`Failed to initialize, due to ${err}, application exiting...`);
    process.exit(1);
  }
}

bootstrap();
