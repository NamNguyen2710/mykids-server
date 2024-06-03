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
      `CREATE TABLE "classrooms" (
				"class_id" int generated always as identity primary key, 
				"name" varchar(50) not null,
				"grade" varchar(20),
				"location" varchar(50),
				"is_active" boolean NOT NULL DEFAULT true, 
        "school_id" int not null,
				FOREIGN KEY (school_id) REFERENCES schools (school_id),
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
        "description" text,
        "menu_id" int not null,
        FOREIGN KEY (menu_id) REFERENCES menu (menu_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu_images" (
        "menu_id" int not null,
        "image_id" int not null,
        PRIMARY KEY ("menu_id", "image_id"),
        FOREIGN KEY (menu_id) REFERENCES menu (menu_id),
        FOREIGN KEY (image_id) REFERENCES images (image_id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "menu_images"`);
    await queryRunner.query(`DROP TABLE "meal"`);
    await queryRunner.query(`DROP TABLE "menu"`);
    await queryRunner.query(`DROP TABLE "schedules"`);
    await queryRunner.query(`DROP TABLE "classrooms"`);
    await queryRunner.query(`DROP TABLE "post_images"`);
    await queryRunner.query(`ALTER TABLE images ADD COLUMN post_id int`);
    await queryRunner.query(
      `ALTER TABLE images ADD CONSTRAINT images_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE`,
    );
  }
}
