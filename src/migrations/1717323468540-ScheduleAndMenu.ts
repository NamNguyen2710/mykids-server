import { MigrationInterface, QueryRunner } from 'typeorm';

export class ScheduleAndMenu1717323468540 implements MigrationInterface {
  name = 'ScheduleAndMenu1717323468540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE images DROP CONSTRAINT images_post_id_fkey`,
    );
    await queryRunner.query(`ALTER TABLE images DROP COLUMN post_id`);
    await queryRunner.query(
      `CREATE TABLE "post_images" (
        "post_id" integer NOT NULL, 
        "image_id" integer NOT NULL, 
        PRIMARY KEY ("post_id", "image_id"),
        FOREIGN KEY (post_id) REFERENCES posts (post_id),
        FOREIGN KEY (image_id) REFERENCES hashtags (image_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "school_years" (
        "school_year_id" innt generated always as identity primary key,
        "year" varchar(20) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "school_id" int NOT NULL,
        FOREIGN KEY (school_id) REFERENCES schools (school_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "classrooms" (
				"class_id" int generated always as identity primary key, 
				"name" varchar(50) not null,
				"location" varchar(50),
				"is_active" boolean NOT NULL DEFAULT true, 
        "school_id" int not null,
        "school_year_id" int not null,
				FOREIGN KEY (school_id) REFERENCES schools (school_id),
				FOREIGN KEY (school_year_id) REFERENCES school_years (school_year_id)
			)`,
    );
    await queryRunner.query(
      `CREATE TABLE "students" (
				"student_id" int generated always as identity primary key, 
				"first_name" varchar(50) not null,
				"last_name" varchar(50) not null,
        "date_of_birth" date not null,
				"permanent_address" varchar(100) not null,
				"current_address" varchar(100) not null,
        "ethnic" varchar(20) not null,
        "birth_place" varchar(20) not,
        "gender" enum('male', 'female') not null,
				"is_active" boolean NOT NULL DEFAULT true, 
        "information" text,
        "school_id" int not null,
				FOREIGN KEY (school_id) REFERENCES schools (school_id)
			)`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_histories" (
				"student_id" int not null, 
        "class_id" int not null,
        "description" text,
        PRIMARY KEY ("student_id", "class_id"),
				FOREIGN KEY (student_id) REFERENCES students (student_id),
				FOREIGN KEY class_id) REFERENCES classrooms (class_id)
			)`,
    );
    await queryRunner.query(
      `CREATE TABLE "students_parents" (
				"student_id" int not null, 
        "parent_id" int not null,
        PRIMARY KEY ("student_id", "parent_id"),
				FOREIGN KEY (student_id) REFERENCES students (student_id),
				FOREIGN KEY (parent_id) REFERENCES users (user_id)
			)`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedules" (
				"schedule_id" int generated always as identity primary key, 
				"name" varchar(50) not null, 
				"description" text, 
				"start_time" timestamptz not null, 
				"end_time" timestamptz not null, 
				"location" varchar(50),
				"class_id" int not null,
				FOREIGN KEY (class_id) REFERENCES classrooms (class_id)
			)`,
    );
    await queryRunner.query(
      `CREATE TABLE "menus" (
        "menu_id" int generated always as identity primary key,
        "name" varchar(50) not null,
        "description" text,
        "date" date not null,
        "meal_period" enum('breakfast', 'lunch', 'supper', 'dinner') not null
        class_id int not null,
        FOREIGN KEY (class_id) REFERENCES classrooms (class_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "meals" (
        "meal_id" int generated always as identity primary key,
        "name" varchar(50) not null,
        "ingredients" text,
        "nutrition" text,
        "is_vegetarian" boolean,
        "is_gluten_free" boolean,
        "type" enum('appetizer', 'vegetable', 'main', 'side', 'soup', 'beverage', 'dessert', 'other') not null,
        "menu_id" int not null,
        FOREIGN KEY (menu_id) REFERENCES menus (menu_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "meal_images" (
        "meal_id" int not null,
        "image_id" int not null,
        PRIMARY KEY ("meal_id", "image_id"),
        FOREIGN KEY (meal_id) REFERENCES meal (meal_id),
        FOREIGN KEY (image_id) REFERENCES images (image_id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "meal_images"`);
    await queryRunner.query(`DROP TABLE "meals"`);
    await queryRunner.query(`DROP TABLE "menus"`);
    await queryRunner.query(`DROP TABLE "schedules"`);
    await queryRunner.query(`DROP TABLE "students_parents"`);
    await queryRunner.query(`DROP TABLE "class_histories"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "classrooms"`);
    await queryRunner.query(`DROP TABLE "school_years"`);
    await queryRunner.query(`DROP TABLE "post_images"`);
    await queryRunner.query(`ALTER TABLE images ADD COLUMN post_id int`);
    await queryRunner.query(
      `ALTER TABLE images ADD CONSTRAINT images_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE`,
    );
  }
}
