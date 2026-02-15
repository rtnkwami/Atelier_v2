import { Controller, Inject, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { RpcRequestValidationPipe } from './pipes/request.validation.pipe';
import {
  Command,
  CommitStockEventSchema,
  CommitStockResponseSchema,
  InventoryEvents,
  OrderEvents,
  PaymentEvents,
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
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('INVENTORY_SERVICE') private readonly client: ClientProxy,
  ) {}

  @EventPattern(OrderEvents.OrderPlaced)
  @UsePipes(new RpcRequestValidationPipe(ReserveStockEventSchema))
  @ValidateRpcResponse(ReserveStockResponseSchema)
  public async reserveProductStock(@Payload() payload: ReserveStockEvent) {
    const response = await this.inventoryService.reserveInventory(payload);

    if (response.success) {
      this.client.emit(InventoryEvents.InventoryReserved, response.data);
    }

    if (response.error) {
      this.client.emit(InventoryEvents.InventoryExhausted, response.error);
    }
  }

  @MessagePattern(PaymentEvents.PaymentSucceeded)
  @UsePipes(new RpcRequestValidationPipe(CommitStockEventSchema))
  @ValidateRpcResponse(CommitStockResponseSchema)
  public async commitStockReservation(@Payload() payload: CommitStockEvent) {
    const response =
      await this.inventoryService.commitInventoryReservations(payload);
    this.client.emit(InventoryEvents.InventoryCommitted, response);
  }

  @MessagePattern(Command.ReleaseStock)
  @UsePipes(new RpcRequestValidationPipe(ReleaseStockEventSchema))
  public async releaseInventory(@Payload() payload: ReleaseStockReservation) {
    return this.inventoryService.releaseInventory(payload);
  }
}
