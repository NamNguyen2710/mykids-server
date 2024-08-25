import { MigrationInterface, QueryRunner } from 'typeorm';

export class HotfixErrors1724566968488 implements MigrationInterface {
  name = 'HotfixErrors1724566968488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "post_images"`);
    await queryRunner.query(
      `ALTER TABLE "albums" ADD COLUMN "is_published" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "albums" ADD COLUMN "title" varchar`);
    await queryRunner.query(`UPDATE albums SET title = ''`);
    await queryRunner.query(
      `ALTER TABLE albums ALTER COLUMN title SET NOT NULL`,
    );
    await queryRunner.query(`
			ALTER TABLE "students" 
			ADD COLUMN "logo_id" int,
			ADD FOREIGN KEY ("logo_id") REFERENCES "assets" ("asset_id")
		`);
    await queryRunner.query(`
			ALTER TABLE "users" 
			ADD COLUMN "logo_id" int,
			ADD FOREIGN KEY ("logo_id") REFERENCES "assets" ("asset_id")
		`);

    await queryRunner.query(`
			ALTER TABLE "medicals"
			ADD COLUMN history TEXT NOT NULL DEFAULT '',
			ADD COLUMN current_medication TEXT NOT NULL DEFAULT '',
			ADD COLUMN allergies TEXT NOT NULL DEFAULT '',
			ADD COLUMN vaccinations TEXT NOT NULL DEFAULT '',
			ADD COLUMN instruction TEXT NOT NULL DEFAULT '';
		`);
  }

  public async down(): Promise<void> {}
}
