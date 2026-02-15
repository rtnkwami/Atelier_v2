import { Migration } from '@mikro-orm/migrations';

export class Migration20260212230244 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "stock_reservation" drop column "reserved_stock";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "stock_reservation" add column "reserved_stock" int not null;`,
    );
  }
}
