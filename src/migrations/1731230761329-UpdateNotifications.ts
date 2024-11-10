import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNotifications1731230761329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE base_notifications (
        notification_id SERIAL PRIMARY KEY,
        school_id INT NOT NULL,
        class_id INT,
        role_id INT,
        title VARCHAR NOT NULL,
        body VARCHAR NOT NULL,
        data JSON,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMPTZ,
        status VARCHAR NOT NULL,
				FOREIGN KEY (school_id) REFERENCES schools (school_id),
				FOREIGN KEY (class_id) REFERENCES classrooms (class_id),
				FOREIGN KEY (role_id) REFERENCES roles (role_id)
      )
    `);

    await queryRunner.query(`
      ALTER TABLE notifications
				ADD COLUMN data JSON,
				ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      	ADD COLUMN base_notification_id INT,
				ADD FOREIGN KEY (base_notification_id) REFERENCES base_notifications(notification_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE notifications
      	DROP COLUMN data,
				DROP COLUMN updated_at,
				DROP COLUMN base_notification_id
    `);

    await queryRunner.query(`
      DROP TABLE base_notifications;
    `);
  }
}
