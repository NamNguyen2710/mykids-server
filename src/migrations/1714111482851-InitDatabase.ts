import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1714111482851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table if exists users`);
    await queryRunner.query(`drop table if exists roles`);
    await queryRunner.query(`drop table if exists app_clients`);

    await queryRunner.query(`
        create table roles (
            role_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            role_name varchar(30) not null
        )`);

    await queryRunner.query(`
        create table users (
            user_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            first_name varchar(50) NOT NULL,
            last_name varchar(50) NOT NULL,
            phone_number varchar(15) NOT NULL unique,
            otp varchar(6),
            otp_expires_at timestamptz,
            is_active boolean default true not null,
            created_at timestamptz not null default CURRENT_TIMESTAMP,
            updated_at timestamptz not null default CURRENT_TIMESTAMP,
            role_id int not null,
            FOREIGN KEY (role_id) REFERENCES roles (role_id)
        );`);

    await queryRunner.query(`
        create table app_clients (
            client_id varchar(30),
            secret varchar(100),
            expires_in int not null,
            primary key(client_id)
        )`);

    await queryRunner.query(
      `insert into roles (role_name) values ('Super Admin'), ('School Admin'), ('Parent')`,
    );
    await queryRunner.query(
      `insert into users (role_id, first_name, last_name, phone_number) values (1, 'Nam', 'Nguyen', '+84123456789'), (2, 'Huy', 'Vo', '+841234567890')`,
    );
    await queryRunner.query(
      `insert into app_clients(client_id, secret, expires_in) values ('BETA', 'N6pMydl9NoeIkpa9lfbLW7g1SblS4gNf', 60)`,
    );
  }

  public async down(): Promise<void> {}
}
