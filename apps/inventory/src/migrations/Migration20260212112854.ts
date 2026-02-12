import { Migration } from '@mikro-orm/migrations';

export class Migration20260212112854 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product" alter column "name" type tsvector using ("name"::tsvector);`);
    this.addSql(`create index "product_name_index" on "public"."product" using gin("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "product_name_index";`);

    this.addSql(`alter table "product" alter column "name" type varchar(255) using ("name"::varchar(255));`);
  }

}
