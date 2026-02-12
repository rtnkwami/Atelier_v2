import { EntityManager, FilterQuery, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import {
  ProductCreate,
  ProductSearch,
} from 'src/validation/product.validation';

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

  public async searchProducts(
    filters?: ProductSearch,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const search: FilterQuery<Product> = {};
    if (filters?.name) {
      search.name = { $fulltext: filters.name };
    }
    if (filters?.category) {
      search.category = filters.category;
    }
    if (filters?.minPrice || filters?.maxPrice) {
      search.price = {};
      if (filters.minPrice) search.price.$gte = filters.minPrice;
      if (filters.maxPrice) search.price.$lte = filters.maxPrice;
    }

    const qb = this.em.createQueryBuilder(Product);
    qb.select(['id', 'name', 'description', 'category', 'price'])
      .where(search)
      .limit(limit)
      .offset(skip);
    const [results, count] = await qb.getResultAndCount();

    return {
      products: results,
      page,
      perPage: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
