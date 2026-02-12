import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductCreate } from 'src/validation/product.validation';

@Injectable()
export class InventoryService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  public async createProduct(data: ProductCreate) {
    const product = this.em.create(Product, data);
    await this.em.flush();
    return product;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
