import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppClientRole1720511391265 implements MigrationInterface {
  name = 'AppClientRole1720511391265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "app_clients_role" (
            "client_id" VARCHAR(50) NOT NULL,
            "role_id" int NOT NULL,
            PRIMARY KEY ("client_id", "role_id"),
            FOREIGN KEY (client_id) REFERENCES app_clients (client_id),
            FOREIGN KEY (role_id) REFERENCES roles (role_id)
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "app_clients_role"`);
  }
}
