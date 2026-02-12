import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { InventoryService } from './app.service';
import {
  CreateProductSchema,
  type ProductSearch,
  SearchProductSchema,
  type ProductCreate,
  type ProductUpdate,
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

  @Get(':id')
  private getProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.inventoryService.getProduct(id);
  }

  @Patch(':id')
  private updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: ProductUpdate,
  ) {
    return this.inventoryService.updateProduct(id, data);
  }
}
