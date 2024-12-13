import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfiguration = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Teslo shop')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
};
