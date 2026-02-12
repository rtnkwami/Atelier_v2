import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { StockReservation } from './reservation.entity';
import { randomUUID } from 'crypto';
import { Product } from './product.entity';

@Entity()
export class ReservationItem {
  @PrimaryKey()
  id: string = randomUUID();

  @ManyToOne(() => StockReservation)
  reservation: StockReservation;

  @ManyToOne(() => Product)
  product: Product;

  @Property({ type: 'int' })
  quantity: number;
}
