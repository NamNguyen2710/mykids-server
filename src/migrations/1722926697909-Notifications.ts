import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1722926697909 implements MigrationInterface {
  name = 'Notifications1722926697909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" (
        "notification_id" int generated always as identity primary key, 
        "user_id" integer NOT NULL, 
        "notification_title" character varying NOT NULL, 
        "notification_body" character varying, 
        "notification_created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
        "read_status" boolean NOT NULL DEFAULT false, 
        FOREIGN KEY (user_id) REFERENCES users (user_id)
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_tokens" (
        "id" int generated always as identity primary key, 
        "user_id" integer NOT NULL, 
        "device_type" character varying NOT NULL, 
        "notification_token" character varying NOT NULL, 
        "status" character varying NOT NULL DEFAULT 'ACTIVE', 
        FOREIGN KEY (user_id) REFERENCES users (user_id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notification_tokens"`);
  }
}
