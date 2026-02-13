import { Controller, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcRequestValidationPipe } from './pipes/request.validation.pipe';
import {
  Command,
  type ReserveStockCommand,
  ReserveStockCommandSchema,
} from 'contracts';
import { CreateRequestContext } from '@mikro-orm/core';

@Controller()
export class NatsController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern(Command.ReserveStock)
  @UsePipes(new RpcRequestValidationPipe(ReserveStockCommandSchema))
  @CreateRequestContext()
  public reserveProductStock(@Payload() payload: ReserveStockCommand) {
    return this.inventoryService.reserveInventory(payload);
  }
}
