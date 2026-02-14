import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from '@mikro-orm/core';
import { StockReservation } from './reservation.entity';
import { randomUUID } from 'crypto';
import { Product } from './product.entity';

@Entity()
export class ReservationItem {
  @PrimaryKey()
  id: string = randomUUID();

  @ManyToOne({ entity: () => StockReservation })
  reservation: Rel<StockReservation>; // use Rel<> to avoid initialization errors due to circular deps

  @ManyToOne({ entity: () => Product })
  product: Rel<Product>; // use Rel<> to avoid initialization errors due to circular deps

  @Property({ type: 'int' })
  quantity: number;
}
