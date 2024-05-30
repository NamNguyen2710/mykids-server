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

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => Users)
  user: Users;

  @Column({ name: 'device_type' })
  deviceType: string;

  @Column({ name: 'notification_token' })
  notificationToken: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;
}
