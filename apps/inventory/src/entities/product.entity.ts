import {
  DecimalType,
  Entity,
  JsonType,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity()
export class Product {
  [OptionalProps]?: 'description' | 'images' | 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: string;

  @Property({ unique: true })
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
}
