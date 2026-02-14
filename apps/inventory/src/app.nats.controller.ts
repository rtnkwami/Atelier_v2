import { Controller, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcRequestValidationPipe } from './pipes/request.validation.pipe';
import {
  Command,
  CommitStockEventSchema,
  CommitStockResponseSchema,
  ReleaseStockEventSchema,
  ReserveStockEventSchema,
  ReserveStockResponseSchema,
} from 'contracts';
import type {
  CommitStockEvent,
  ReleaseStockReservation,
  ReserveStockEvent,
} from 'contracts';
import { ValidateRpcResponse } from './validation/response.validation.decorator';

@Controller()
export class NatsController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern(Command.ReserveStock)
  @UsePipes(new RpcRequestValidationPipe(ReserveStockEventSchema))
  @ValidateRpcResponse(ReserveStockResponseSchema)
  public async reserveProductStock(@Payload() payload: ReserveStockEvent) {
    return await this.inventoryService.reserveInventory(payload);
  }

  @MessagePattern(Command.CommitReservation)
  @UsePipes(new RpcRequestValidationPipe(CommitStockEventSchema))
  @ValidateRpcResponse(CommitStockResponseSchema)
  public async commitStockReservation(@Payload() payload: CommitStockEvent) {
    return await this.inventoryService.commitInventoryReservations(payload);
  }

  @MessagePattern(Command.ReleaseStock)
  @UsePipes(new RpcRequestValidationPipe(ReleaseStockEventSchema))
  public async releaseInventory(@Payload() payload: ReleaseStockReservation) {
    return this.inventoryService.releaseInventory(payload);
  }
}
