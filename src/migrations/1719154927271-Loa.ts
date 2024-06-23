import { MigrationInterface, QueryRunner } from 'typeorm';

export class Loa1717323468540 implements MigrationInterface {
  name = 'Loa1719154927271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "loa" (
        "loa_id" int generated always as identity primary key, 
        "student_id" integer NOT NULL,
        "class_id" integer NOT NULL,
        "created_by_id" int NOT NULl,
        "description" text NOT NULL,
        "start_date" Date NOT NULL,
        "end_date" Date NOT NULL,
        "created_at" Date NOT NULL,
        "approve_status" varchar(10) NOT NULL,
        FOREIGN KEY (created_by_id) REFERENCES users (user_id),
        FOREIGN KEY (student_id) REFERENCES students (student_id),
        FOREIGN KEY (class_id) REFERENCES classrooms (class_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "loa_image" (
        "loa_id" int NOT NULL,
        "image_id" int NOT NULL,
        PRIMARY KEY ("image_id", "loa_id"),
        FOREIGN KEY (loa_id) REFERENCES loa (loa_id),
        FOREIGN KEY (image_id) REFERENCES images (image_id)
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "role_id" DROP IDENTITY IF EXISTS`,
    );

    await queryRunner.query(`
      ALTER TABLE "schedules" 
        ADD COLUMN "resources" text NOT NULL, 
        ADD COLUMN "learning_objective" text NOT NULL, 
        ADD COLUMN "learning outcome" text NOT NULL
      `);
    await queryRunner.query(
      `ALTER TABLE "students_parents" ADD COLUMN "relationship" varchar(16) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "profession" varchar(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "loa", "loa_image"`);
    await queryRunner.query(`
      ALTER TABLE "schedules" 
        DROP COLUMN "resources", 
        DROP COLUMN "learning_objective", 
        DROP COLUMN "learning outcome"
      `);
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER "role_id" ADD GENERATED ALWAYS AS IDENTITY`,
    );
    await queryRunner.query(
      `ALTER TABLE "students_parents" DROP COLUMN "relationship"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profession"`);
  }
}
