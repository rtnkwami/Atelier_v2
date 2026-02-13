import { EntityManager, FilterQuery, MikroORM } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import type {
  ProductCreate,
  ProductSearch,
  ProductUpdate,
} from 'src/validation/product.validation';
import {
  CreateRequestContext,
  LockMode,
  Transactional,
  wrap,
} from '@mikro-orm/core';
import type { ReserveStockCommand } from 'contracts';
import { StockReservation } from './entities/reservation.entity';
import { ReservationItem } from './entities/reservation-item.entity';
import { RpcException } from '@nestjs/microservices';

type ProductSearchResult = {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
};

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
      search.name = { $ilike: filters.name };
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
    const [results, count] = (await qb.getResultAndCount()) as [
      ProductSearchResult[],
      number,
    ];

    return {
      products: results,
      page,
      perPage: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  public async getProduct(id: string) {
    const qb = this.em.createQueryBuilder(Product);
    qb.select(['id', 'name', 'description', 'price', 'category']).where({ id });
    const result = (await qb.getSingleResult()) as ProductSearchResult | null;

    if (!result)
      throw new NotFoundException('the requested product does not exist');

    return result;
  }

  @Transactional()
  public async updateProduct(id: string, data: ProductUpdate) {
    const product = await this.em.findOne(Product, id);
    if (!product) {
      throw new NotFoundException(`Product ${id} does not exist`);
    }
    wrap(product).assign(data);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      images: product.images,
    };
  }

  @Transactional()
  public async deleteProduct(id: string) {
    const deletedProduct = await this.em.findOne(Product, id);
    if (!deletedProduct)
      throw new NotFoundException(`Product ${id} does not exist`);

    this.em.remove(deletedProduct);
    return {
      id: deletedProduct.id,
      name: deletedProduct.name,
      description: deletedProduct.description,
      category: deletedProduct.category,
      price: deletedProduct.price,
      stock: deletedProduct.stock,
      images: deletedProduct.images,
    };
  }

  private async findOrCreateReservation(reservationId: string) {
    const existingReservation = await this.em.findOne(
      StockReservation,
      { reservationId },
      { populate: ['items'] },
    );

    const reservation = existingReservation ?? new StockReservation();
    if (!existingReservation) {
      reservation.reservationId = reservationId;
      this.em.persist(reservation);
    }
    return reservation;
  }

  private async validateProductStock(id: string, requestedQuantity: number) {
    const product = await this.em.findOne(
      Product,
      { id },
      { lockMode: LockMode.PESSIMISTIC_WRITE, populate: ['reservations'] },
    );
    if (!product) {
      throw new NotFoundException(`Product ${id} does not exist`);
    }

    const currentReservedStock = product.reservations.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    const totalRequestedStock = currentReservedStock + requestedQuantity;

    if (product.stock - totalRequestedStock < 0) {
      return {
        error: {
          id: product.id,
          requested: requestedQuantity,
          stock: product.stock - currentReservedStock,
        },
      };
    }
    return { product };
  }

  @CreateRequestContext()
  @Transactional()
  public async reserveInventory(data: ReserveStockCommand) {
    const sortedRequestItems = [...data.products].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    const reservation = await this.findOrCreateReservation(data.reservationId);

    const reservationItems: ReservationItem[] = [];
    const reservationErrors: {
      id: string;
      requested: number;
      stock: number;
    }[] = [];

    for (const requested of sortedRequestItems) {
      const { product, error } = await this.validateProductStock(
        requested.id,
        requested.quantity,
      );

      if (error) {
        reservationErrors.push(error);
        continue;
      }

      if (product) {
        const item = new ReservationItem();
        item.product = product;
        item.quantity = requested.quantity;
        item.reservation = reservation;

        reservationItems.push(item);
      }
    }

    if (reservationErrors.length > 0) {
      throw new RpcException({
        message: 'insufficient stock for one or more products',
        stockValidation: reservationErrors,
      });
    }
    reservation.items.set(reservationItems);

    return {
      reservationId: data.reservationId,
      created: reservation.createdAt,
      expires: reservation.expiresAt,
    };
  }
}
