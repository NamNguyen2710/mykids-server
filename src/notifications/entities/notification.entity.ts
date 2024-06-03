import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { NotificationToken } from './notification-token.entity';
import { Users } from 'src/users/entity/users.entity';
import { timeStamp } from 'console';

@Entity({ name: 'notifications' })
export class Notifications {
  @PrimaryGeneratedColumn({ name: 'notification_id' })
  id: number;

  // @JoinColumn({ name: 'notification_token_id', referencedColumnName: 'id' })
  // @ManyToOne(() => NotificationToken)
  // notificationToken: NotificationToken;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => Users)
  users: Users;

  @Column({ name: 'notification_title' })
  title: string;

  @Column({ name: 'notification_body', nullable: true })
  body: string;

  @CreateDateColumn({ name: 'notification_created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'read_status', default: false })
  readStatus: boolean;
}
