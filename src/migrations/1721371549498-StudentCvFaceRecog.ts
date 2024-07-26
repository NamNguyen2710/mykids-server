import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentCvFaceRecog1721371549498 implements MigrationInterface {
  name = 'StudentCvFaceRecog1721371549498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_cv" (
                "cv_id" int generated always as identity primary key,
                "cv_url" text NOT NULL,
                "mime_type" text,
                "student_id" int NOT NULL:,
                FOREIGN KEY (student_id) REFERENCES students (student_id)
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
