import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from '@mikro-orm/core';
import { Product } from './product.entity';

@Entity()
export class StockReservation {
  [PrimaryKeyProp]?: ['reservationId', 'product'];

  @PrimaryKey()
  reservationId: string;

  @ManyToOne(() => Product, { primary: true })
  product: Product;

  @Property()
  reservedStock: number;

  @Property()
  createdAt: Date = new Date();

  @Property({
    onCreate: () => new Date(Date.now() + 15 * 60 * 1000),
  })
  expiresAt: Date;
}
