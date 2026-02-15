import { Migration } from '@mikro-orm/migrations';

export class Migration20260212225824 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "product" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) null, "category" varchar(255) not null, "price" numeric(10,2) not null, "stock" int not null, "images" jsonb not null default '[]', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "product_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "product" add constraint "product_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "stock_reservation" ("reservation_id" varchar(255) not null, "reserved_stock" int not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, constraint "stock_reservation_pkey" primary key ("reservation_id"));`,
    );

    this.addSql(
      `create table "reservation_item" ("id" varchar(255) not null, "reservation_reservation_id" varchar(255) not null, "product_id" uuid not null, "quantity" varchar(255) not null, constraint "reservation_item_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "reservation_item" add constraint "reservation_item_reservation_reservation_id_foreign" foreign key ("reservation_reservation_id") references "stock_reservation" ("reservation_id") on update cascade;`,
    );
    this.addSql(
      `alter table "reservation_item" add constraint "reservation_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "reservation_item" drop constraint "reservation_item_product_id_foreign";`,
    );

    this.addSql(
      `alter table "reservation_item" drop constraint "reservation_item_reservation_reservation_id_foreign";`,
    );

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "stock_reservation" cascade;`);

    this.addSql(`drop table if exists "reservation_item" cascade;`);
  }
}
