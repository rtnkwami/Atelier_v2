import { Module } from '@nestjs/common';
import { HttpController } from './app.http.controller';
import { InventoryService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MikroOrmModule.forRoot(config),
  ],
  controllers: [HttpController],
  providers: [InventoryService],
})
export class AppModule {}
