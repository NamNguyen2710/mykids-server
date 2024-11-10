import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { BaseNotifications } from 'src/base-notification/entities/base-notification.entity';

@Entity({ name: 'notifications' })
export class Notifications {
  @PrimaryGeneratedColumn({ name: 'notification_id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users, (user) => user.notifications)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @Column({ name: 'notification_title' })
  title: string;

  @Column({ name: 'notification_body', nullable: true })
  body: string;

  @Column({ name: 'read_status', default: false })
  readStatus: boolean;

  @Column({ type: 'json', nullable: true })
  data: Record<string, string>;

  @Column({ name: 'base_notification_id', nullable: true })
  baseNotificationId: number;

  @ManyToOne(
    () => BaseNotifications,
    (baseNotification) => baseNotification.notifications,
    { nullable: true },
  )
  @JoinColumn({ name: 'base_notification_id', referencedColumnName: 'id' })
  baseNotification: BaseNotifications;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
