import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAndRole1728213891441 implements MigrationInterface {
  name = 'UpdateUserAndRole1728213891441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "parents" (
        "user_id" integer NOT NULL PRIMARY KEY,
        "profession" character varying,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "school_faculties" (
        "user_id" integer NOT NULL PRIMARY KEY,
        "school_id" integer NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      INSERT INTO parents (user_id, profession)
      SELECT user_id, profession
      FROM users
      WHERE role_id = 3
    `);
    await queryRunner.query(`
      INSERT INTO school_faculties (user_id, school_id)
      SELECT school_admin_id, school_id
      FROM schools
    `);
    await queryRunner.query(`
      ALTER TABLE "students_parents"
        DROP CONSTRAINT "students_parents_parent_id_fkey",
        ADD CONSTRAINT "students_parents_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES parents (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "permission_id" integer NOT NULL PRIMARY KEY,
        "name" character varying NOT NULL,
        "description" character varying
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "role_id" integer NOT NULL,
        "permission_id" integer NOT NULL,
        "is_active" boolean DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("role_id", "permission_id"),
        FOREIGN KEY ("role_id") REFERENCES roles (role_id) ON DELETE CASCADE,
        FOREIGN KEY ("permission_id") REFERENCES permissions (permission_id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "roles" 
        ADD COLUMN "school_id" integer,
        ADD FOREIGN KEY ("school_id") REFERENCES schools (school_id) ON DELETE CASCADE,
        ALTER "role_id" ADD GENERATED ALWAYS AS IDENTITY
    `);
    await queryRunner.query(`
      ALTER TABLE "schools" 
        DROP CONSTRAINT "schools_school_admin_id_fkey",
        DROP COLUMN "school_admin_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "school_parents" 
        DROP CONSTRAINT "school_parents_parent_id_fkey",
        ADD CONSTRAINT "school_parents_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES parents (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      CREATE TABLE "work_histories" (
        "work_id" SERIAL NOT NULL PRIMARY KEY,
        "class_id" integer NOT NULL,
        "faculty_id" integer NOT NULL,
        "start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
        "end_date" DATE,
        FOREIGN KEY ("class_id") REFERENCES classrooms (class_id) ON DELETE CASCADE,
        FOREIGN KEY ("faculty_id") REFERENCES school_faculties (user_id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "loa" 
        DROP CONSTRAINT "loa_created_by_id_fkey",
        ADD CONSTRAINT "loa_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES parents (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "albums" 
        DROP CONSTRAINT "albums_created_by_id_fkey",
        ADD CONSTRAINT "albums_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES school_faculties (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "class_histories"
        ADD COLUMN "start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
        ADD COLUMN "end_date" DATE
    `);
    await queryRunner.query(`
      ALTER TABLE "posts"
        ADD COLUMN "class_id" integer,
        ADD FOREIGN KEY (class_id) REFERENCES classrooms (class_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profession"`);
    await queryRunner.query(`
      alter table users 
        alter column "phone_number" drop not null,
        add column "deleted_at" timestamp with time zone
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table users 
        alter column "phone_number" set not null,
        drop column "deleted_at"
    `);
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "profession" character varying`,
    );
    await queryRunner.query(`
      ALTER TABLE "posts"
        DROP CONSTRAINT "posts_class_id_fkey",
        DROP COLUMN "class_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "class_histories" 
        DROP COLUMN "end_date",
        DROP COLUMN "start_date"
    `);
    await queryRunner.query(`
      ALTER TABLE "albums" 
        DROP CONSTRAINT "albums_created_by_id_fkey",
        ADD CONSTRAINT "albums_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES users (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "loa"
        DROP CONSTRAINT "loa_created_by_id_fkey",
        ADD CONSTRAINT "loa_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES users (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`DROP TABLE "work_histories"`);
    await queryRunner.query(`
      ALTER TABLE "school_parents" 
        DROP CONSTRAINT "school_parents_parent_id_fkey",
        ADD CONSTRAINT "school_parents_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES users (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "schools" 
        ADD COLUMN "school_admin_id" integer,
        ADD CONSTRAINT "schools_school_admin_id_fkey" FOREIGN KEY ("school_admin_id") REFERENCES users (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "roles" 
        DROP CONSTRAINT "roles_school_id_fkey",
        DROP COLUMN "school_id",
        ALTER "role_id" DROP GENERATED ALWAYS
    `);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`
      ALTER TABLE "students_parents" 
        DROP CONSTRAINT "students_parents_parent_id_fkey",
        ADD CONSTRAINT "students_parents_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES users (user_id) ON DELETE CASCADE
    `);
    await queryRunner.query(`DROP TABLE "school_faculties"`);
    await queryRunner.query(`DROP TABLE "parents"`);
  }
}
