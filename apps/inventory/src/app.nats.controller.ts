import { Controller, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcRequestValidationPipe } from './pipes/request.validation.pipe';
import {
  Command,
  type CommitStockReservation,
  CommitStockReservationSchema,
  CommitStockResponseSchema,
  type ReleaseStockReservation,
  ReleaseStockReservationSchema,
  type ReserveStockCommand,
  ReserveStockCommandSchema,
  ReserveStockResponseSchema,
} from 'contracts';
import { ValidateRpcResponse } from './validation/response.validation.decorator';

@Controller()
export class NatsController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern(Command.ReserveStock)
  @UsePipes(new RpcRequestValidationPipe(ReserveStockCommandSchema))
  @ValidateRpcResponse(ReserveStockResponseSchema)
  public async reserveProductStock(@Payload() payload: ReserveStockCommand) {
    return await this.inventoryService.reserveInventory(payload);
  }

  @MessagePattern(Command.CommitReservation)
  @UsePipes(new RpcRequestValidationPipe(CommitStockReservationSchema))
  @ValidateRpcResponse(CommitStockResponseSchema)
  public async commitStockReservation(
    @Payload() payload: CommitStockReservation,
  ) {
    return await this.inventoryService.commitInventoryReservations(payload);
  }

  @MessagePattern(Command.ReleaseStock)
  @UsePipes(new RpcRequestValidationPipe(ReleaseStockReservationSchema))
  public async releaseInventory(@Payload() payload: ReleaseStockReservation) {
    return this.inventoryService.releaseInventory(payload);
  }
}
