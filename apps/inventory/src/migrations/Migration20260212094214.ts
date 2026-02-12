import { Migration } from '@mikro-orm/migrations';

export class Migration20260212094214 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "description" varchar(255) null, "category" varchar(255) not null, "price" numeric(10,2) not null, "stock" int not null, "images" jsonb not null default '[]', constraint "product_pkey" primary key ("id"));`);
    this.addSql(`alter table "product" add constraint "product_name_unique" unique ("name");`);
    this.addSql(`alter table "product" add constraint "product_category_unique" unique ("category");`);

    this.addSql(`drop table if exists "agent" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "agent" ("id" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz(6) not null default now(), "last_seen" timestamptz(6) not null default now(), constraint "agent_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "product" cascade;`);
  }

}
