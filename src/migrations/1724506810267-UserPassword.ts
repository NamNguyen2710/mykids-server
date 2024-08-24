import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPassword1724506810267 implements MigrationInterface {
  name = 'UserPassword1724506810267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ADD COLUMN password VARCHAR(255)`,
    );
    await queryRunner.query(`ALTER TABLE users ADD COLUMN email VARCHAR(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN email`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN password`);
  }
}
