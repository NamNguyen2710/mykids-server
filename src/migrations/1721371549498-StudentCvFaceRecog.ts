import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentCvFaceRecog1721371549498 implements MigrationInterface {
  name = 'StudentCvFaceRecog1721371549498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_cvs" (
          "student_id" int not null,
          "asset_id" int not null,
          PRIMARY KEY ("student_id", "asset_id"),
          FOREIGN KEY (student_id) REFERENCES students (student_id),
          FOREIGN KEY (asset_id) REFERENCES assets (asset_id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "student_cvs"`);
  }
}
