import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlbumAndAsset1720511232425 implements MigrationInterface {
  name = 'AlbumAndAsset1720511232425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "albums" (
        "album_id" int generated always as identity primary key,
        "school_id" int NOT NULL,
        "class_id" int,
        "created_by_id" int NOT NULL,
        "created_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "published_date" TIMESTAMPTZ,

        FOREIGN KEY (school_id) REFERENCES schools (school_id),
        FOREIGN KEY (created_by_id) REFERENCES users (user_id),
        FOREIGN KEY (class_id) REFERENCES classrooms (class_id)
      )`,
    );
    await queryRunner.query(`ALTER TABLE "images" RENAME TO "assets"`);
    await queryRunner.query(
      `ALTER TABLE "assets" RENAME COLUMN "image_id" TO "asset_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "album_assets" (
        "album_id" int NOT NULL,
        "asset_id" int NOT NULL,
        PRIMARY KEY ("album_id", "asset_id"),
        FOREIGN KEY (album_id) REFERENCES albums (album_id) ON DELETE CASCADE,
        FOREIGN KEY (asset_id) REFERENCES assets (asset_id) ON DELETE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "albums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "album_asset"`);
    await queryRunner.query(`ALTER TABLE "assets" RENAME TO "images"`);
    await queryRunner.query(
      `ALTER TABLE "images" RENAME COLUMN "asset_id" TO "image_id"`,
    );
  }
}
