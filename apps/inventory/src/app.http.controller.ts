import { Controller, Get } from '@nestjs/common';
import { InventoryService } from './app.service';

@Controller()
export class HttpController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getHello(): string {
    return this.inventoryService.getHello();
  }
}
