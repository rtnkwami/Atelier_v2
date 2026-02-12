import { Migration } from '@mikro-orm/migrations';

export class Migration20260212101931 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "stock_reservation" ("reservation_id" varchar(255) not null, "product_id" uuid not null, "reserved_stock" int not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, constraint "stock_reservation_pkey" primary key ("reservation_id", "product_id"));`);

    this.addSql(`alter table "stock_reservation" add constraint "stock_reservation_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "stock_reservation" cascade;`);
  }

}
