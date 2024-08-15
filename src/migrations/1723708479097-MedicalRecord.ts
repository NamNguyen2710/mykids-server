import { MigrationInterface, QueryRunner } from 'typeorm';

export class MedicalRecord1723708479097 implements MigrationInterface {
  name = 'MedicalRecord1723708479097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medicals" (
        "medical_id" int generated always as identity primary key, 
        "school_id" integer NOT NULL, 
        "student_id" integer NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        FOREIGN KEY (school_id) REFERENCES schools (school_id),
        FOREIGN KEY (student_id) REFERENCES students (student_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_assets" (
        "medical_id" integer NOT NULL, 
        "asset_id" integer NOT NULL, 
        PRIMARY KEY ("medical_id", "asset_id"),
        FOREIGN KEY (medical_id) REFERENCES medicals (medical_id),
        FOREIGN KEY (asset_id) REFERENCES assets (asset_id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "medical_assets"`);
    await queryRunner.query(`DROP TABLE "medicals"`);
  }
}
