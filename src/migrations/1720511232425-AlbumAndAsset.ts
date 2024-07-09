import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlbumAndAsset1720511232425 implements MigrationInterface {
  name = 'AlbumAndAsset1720511232425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "album" (
        "album_id" int generated always as identity primary key,
        "school_id" int NOT NULL,
        
        FOREIGN KEY (school_id) REFERENCES schools (school_id)
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD COLUMN "album_id" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" RENAME COLUMN "image_id" TO "asset_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT fk_album_id FOREIGN KEY (album_id) REFERENCES "album" (album_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "album"`);
    await queryRunner.query(
      `ALTER TABLE "images" RENAME COLUMN "asset_id" TO "image_id"`,
    );
    await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT fk_album_id`);
    await queryRunner.query(
      `ALTER TABLE "images" DROP COLUMN IF EXISTS "album_id"`,
    );
  }
}
