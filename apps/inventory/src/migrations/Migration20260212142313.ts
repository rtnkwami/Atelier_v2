import { Migration } from '@mikro-orm/migrations';

export class Migration20260212142313 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product" drop constraint "product_category_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" add constraint "product_category_unique" unique ("category");`);
  }

}
