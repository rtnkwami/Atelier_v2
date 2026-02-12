import {
  Collection,
  DecimalType,
  Entity,
  Index,
  JsonType,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { StockReservation } from './stock-reservation.entity';
import { FullTextType } from '@mikro-orm/postgresql';

@Entity()
export class Product {
  [OptionalProps]?: 'description' | 'images' | 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id = randomUUID();

  @Index({ type: 'fulltext' })
  @Property({ type: FullTextType, unique: true })
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ unique: true })
  category: string;

  @Property({
    type: new DecimalType('number'),
    precision: 10,
    scale: 2,
  })
  price: number;

  @Property()
  stock: number;

  @Property({ type: new JsonType(), default: '[]' })
  images: string[] = [];

  @Property({ defaultRaw: 'now()' })
  createdAt = new Date();

  @Property({
    onUpdate: () => new Date(),
    defaultRaw: 'now()',
  })
  updatedAt = new Date();

  @OneToMany(() => StockReservation, (reservation) => reservation.product)
  stockReservations = new Collection<StockReservation>(this);
}
