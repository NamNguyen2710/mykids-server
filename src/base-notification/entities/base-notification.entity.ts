import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Notifications } from 'src/notifications/entities/notification.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Classrooms } from 'src/class/entities/class.entity';
import { Roles } from 'src/role/entities/roles.entity';

export enum NOTIFICATION_STATUS {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  RETRACTED = 'RETRACTED',
}

@Entity({ name: 'base_notifications' })
export class BaseNotifications {
  @PrimaryGeneratedColumn({ name: 'notification_id' })
  id: number;

  @Column({ name: 'school_id' })
  schoolId: number;

  @Column({ name: 'class_id', nullable: true })
  classId: number;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ name: 'data', type: 'json', nullable: true })
  data: Record<string, string>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @Column()
  status: string;

  @OneToMany(
    () => Notifications,
    (notification) => notification.baseNotification,
  )
  notifications: Notifications[];

  @ManyToOne(() => Schools, (school) => school.baseNotifications)
  @JoinColumn({ name: 'school_id', referencedColumnName: 'id' })
  school: Schools;

  @ManyToOne(() => Classrooms, (classroom) => classroom.baseNotifications)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
  classroom: Classrooms;

  @ManyToOne(() => Roles, (role) => role.baseNotifications)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Roles;
}
