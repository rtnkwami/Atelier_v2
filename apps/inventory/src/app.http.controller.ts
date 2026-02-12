import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { InventoryService } from './app.service';
import {
  CreateProductSchema,
  type ProductSearch,
  SearchProductSchema,
  type ProductCreate,
} from 'src/validation/product.validation';
import { HttpRequestValidationPipe } from './pipes/request.validation.pipe';

@Controller()
export class HttpController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UsePipes(new HttpRequestValidationPipe(CreateProductSchema))
  private createProduct(@Body() data: ProductCreate) {
    return this.inventoryService.createProduct(data);
  }

  @Get()
  @UsePipes(new HttpRequestValidationPipe(SearchProductSchema))
  private searchProducts(@Query() query: ProductSearch) {
    return this.inventoryService.searchProducts(query);
  }

  @Get()
  getHello(): string {
    return this.inventoryService.getHello();
  }
}
