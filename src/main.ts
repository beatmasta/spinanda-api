import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const userService = app.get(UserService);
  await userService.insertMockData();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap().then(() => {
  console.log('App is running at http://localhost:3000');
}).catch((e) => {
    console.error('Error starting app', e);
});
