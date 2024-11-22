import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { swaggerConfiguration } from './shared/swagger/swagger.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.PORT;
  swaggerConfiguration(app);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port, () => {
    Logger.log(`Server running on port: ${port}`, 'main');
  });
}
bootstrap();
