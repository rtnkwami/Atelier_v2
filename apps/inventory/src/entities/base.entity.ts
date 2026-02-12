import { OptionalProps, Property } from '@mikro-orm/core';

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

  @Property({ defaultRaw: 'now()' })
  createdAt = new Date();

  @Property({
    onUpdate: () => new Date(),
    defaultRaw: 'now()',
  })
  updatedAt = new Date();
}
