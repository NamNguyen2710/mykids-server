import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostingSchemas1714965580592 implements MigrationInterface {
  name = 'PostingSchemas1714965580592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE hashtags (
        "hashtag_id" int generated always as identity primary key, 
        "description" varchar(30) NOT NULL unique
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "images" (
        "image_id" int generated always as identity primary key, 
        "url" character varying NOT NULL, 
        "post_id" int
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "schools" (
        "school_id" int generated always as identity primary key, 
        "name" varchar(50) not null,
        "brand_color" varchar(8), 
        "is_active" boolean NOT NULL DEFAULT true, 
        "school_admin_id" int not null unique, 
        "logo_id" int, 
        FOREIGN KEY (school_admin_id) REFERENCES users (user_id),
        FOREIGN KEY (logo_id) REFERENCES images (image_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" (
        "post_id" int generated always as identity primary key, 
        "message" text, 
        "is_published" boolean NOT NULL DEFAULT true, 
        "created_at" timestamptz DEFAULT now(), 
        "updated_at" timestamptz DEFAULT now(), 
        "published_at" timestamptz default now(), 
        "created_by_id" int not null,
        "school_id" int not null,
        FOREIGN KEY (created_by_id) REFERENCES users (user_id),
        FOREIGN KEY (school_id) REFERENCES schools (school_id)
      )`,
    );
    await queryRunner.query(
      'ALTER TABLE "images" ADD FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      `CREATE TABLE "comments" (
        "comment_id" int generated always as identity primary key, 
        "message" text NOT NULL, 
        "created_at" timestamptz DEFAULT now(), 
        "updated_at" timestamptz DEFAULT now(), 
        "deleted_at" timestamptz, 
        "created_by_id" int not null, 
        FOREIGN KEY (created_by_id) REFERENCES users (user_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "school_parents" (
        "school_id" int NOT NULL, 
        "parent_id" int NOT NULL, 
        PRIMARY KEY ("school_id", "parent_id"),
        FOREIGN KEY (school_id) REFERENCES schools (school_id),
        FOREIGN KEY (parent_id) REFERENCES users (user_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_likes" (
        "post_id" integer NOT NULL, 
        "user_id" integer NOT NULL, 
        FOREIGN KEY (post_id) REFERENCES posts (post_id),
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        PRIMARY KEY ("post_id", "user_id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts_hashtags_relation" (
        "post_id" integer NOT NULL, 
        "hashtag_id" integer NOT NULL, 
        PRIMARY KEY ("post_id", "hashtag_id"),
        FOREIGN KEY (post_id) REFERENCES posts (post_id),
        FOREIGN KEY (hashtag_id) REFERENCES hashtags (hashtag_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_tagged_users" (
        "comment_id" integer NOT NULL, 
        "tagged_user_id" integer NOT NULL, 
        PRIMARY KEY ("comment_id", "tagged_user_id"),
        FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
        FOREIGN KEY (tagged_user_id) REFERENCES users (user_id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment_tagged_users"`);
    await queryRunner.query(`DROP TABLE "posts_hashtags_relation"`);
    await queryRunner.query(`DROP TABLE "post_likes"`);
    await queryRunner.query(`DROP TABLE "school_parents"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "schools"`);
    await queryRunner.query(`DROP TABLE "images"`);
    await queryRunner.query(`DROP TABLE "hashtags"`);
  }
}
