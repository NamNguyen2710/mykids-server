import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'notification_tokens' })
export class NotificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users, (user) => user.notiTokens)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ name: 'device_type' })
  deviceType: string;

  @Column({ name: 'notification_token' })
  notificationToken: string;

  @Column({ default: 'ACTIVE' })
  status: string;
}
