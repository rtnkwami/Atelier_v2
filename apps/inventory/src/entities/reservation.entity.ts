import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ReservationItem } from './reservation-item.entity';

@Entity()
export class StockReservation {
  @PrimaryKey()
  reservationId: string;

  @OneToMany(() => ReservationItem, (item) => item.reservation)
  items = new Collection<ReservationItem>(this);

  @Property()
  reservedStock: number;

  @Property()
  createdAt: Date = new Date();

  @Property({
    onCreate: () => new Date(Date.now() + 15 * 60 * 1000),
  })
  expiresAt: Date;
}
