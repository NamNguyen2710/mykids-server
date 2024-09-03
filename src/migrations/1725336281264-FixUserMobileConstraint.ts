import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserMobileConstraint1725336281264
  implements MigrationInterface
{
  name = 'FixUserMobileConstraint1725336281264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "users_phone_number_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_phone_number_key" UNIQUE NULLS NOT DISTINCT ("phone_number")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
