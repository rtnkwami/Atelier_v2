import { Controller, Inject, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { RpcRequestValidationPipe } from './pipes/request.validation.pipe';
import {
  CommitStockEventSchema,
  InventoryEvents,
  OrderEvents,
  PaymentEvents,
  ReleaseStockEventSchema,
  ReserveStockEventSchema,
} from 'contracts';
import type {
  CommitStockEvent,
  ReleaseStockReservation,
  ReserveStockEvent,
} from 'contracts';

@Controller()
export class NatsController {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('INVENTORY_SERVICE') private readonly client: ClientProxy,
  ) {}
//test
  @EventPattern(OrderEvents.OrderPlaced)
  @UsePipes(new RpcRequestValidationPipe(ReserveStockEventSchema))
  public async reserveProductStock(@Payload() payload: ReserveStockEvent) {
    const response = await this.inventoryService.reserveInventory(payload);

    if (response.success) {
      this.client.emit(InventoryEvents.InventoryReserved, response.data);
    }

    if (response.error) {
      this.client.emit(InventoryEvents.InventoryExhausted, response.error);
    }
  }

  @EventPattern(PaymentEvents.PaymentSucceeded)
  @UsePipes(new RpcRequestValidationPipe(CommitStockEventSchema))
  public async commitStockReservation(@Payload() payload: CommitStockEvent) {
    const response =
      await this.inventoryService.commitInventoryReservations(payload);
    this.client.emit(InventoryEvents.InventoryCommitted, response);
  }

  @EventPattern(OrderEvents.OrderCancelled)
  @UsePipes(new RpcRequestValidationPipe(ReleaseStockEventSchema))
  public async releaseInventory(@Payload() payload: ReleaseStockReservation) {
    const response = await this.inventoryService.releaseInventory(payload);
    this.client.emit(InventoryEvents.InventoryReleased, response);
  }
}
