import { Controller, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcRequestValidationPipe } from './pipes/request.validation.pipe';
import {
  Command,
  type ReserveStockCommand,
  ReserveStockCommandSchema,
} from 'contracts';

@Controller()
export class NatsController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern(Command.ReserveStock)
  @UsePipes(new RpcRequestValidationPipe(ReserveStockCommandSchema))
  public reserveProductStock(@Payload() payload: ReserveStockCommand) {
    return this.inventoryService.reserveInventory(payload);
  }
}
