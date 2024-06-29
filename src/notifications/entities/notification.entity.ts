import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entity/users.entity';

@Entity({ name: 'notifications' })
export class Notifications {
  @PrimaryGeneratedColumn({ name: 'notification_id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @Column({ name: 'notification_title' })
  title: string;

  @Column({ name: 'notification_body', nullable: true })
  body: string;

  @CreateDateColumn({ name: 'notification_created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'read_status', default: false })
  readStatus: boolean;
}
