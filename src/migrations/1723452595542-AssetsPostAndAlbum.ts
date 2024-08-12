import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssetsPostAndAlbum1723452595542 implements MigrationInterface {
  name = 'AssetsPostAndAlbum1723452595542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_assets" (
        "post_id" integer NOT NULL, 
        "image_id" integer NOT NULL, 
        PRIMARY KEY ("post_id", "image_id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post_assets"`);
  }
}
