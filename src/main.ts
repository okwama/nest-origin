import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Flutter app
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:8080', 
      'http://localhost:54355',
      'http://localhost:54356',
      'http://localhost:52531',
      'http://192.168.100.2:52531',
      'capacitor://localhost'
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Woosh NestJS Server running on port ${port}`);
  console.log(`📱 API available at http://localhost:${port}/api`);
}

bootstrap(); 