import { Migration } from '@mikro-orm/migrations';

export class Migration20260212231414 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "reservation_item" alter column "quantity" type int using ("quantity"::int);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "reservation_item" alter column "quantity" type varchar(255) using ("quantity"::varchar(255));`,
    );
  }
}
