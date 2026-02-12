import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_ENDPOINT || 'nats://localhost:4222'],
      queue: 'inventory_queue',
      waitOnFirstConnect: true,
      reconnect: true,
      reconnectTimeWait: 5000,
      reconnectJitter: 1000,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
