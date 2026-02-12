import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import {
  CreateProductSchema,
  type ProductCreate,
} from 'src/validation/product.validation';
import { HttpRequestValidationPipe } from './pipes/request.validation.pipe';
import { Product } from './entities/product.entity';

@Controller()
export class HttpController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UsePipes(new HttpRequestValidationPipe(CreateProductSchema))
  private createProduct(@Body() data: ProductCreate): Promise<Product> {
    return this.inventoryService.createProduct(data);
  }

  @Get()
  getHello(): string {
    return this.inventoryService.getHello();
  }
}
