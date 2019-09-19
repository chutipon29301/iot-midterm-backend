import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_CONNECTION_STRING,
    },
  });
  app.startAllMicroservices();
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
