import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Schools } from 'src/school/entities/school.entity';
import { Schedules } from 'src/schedule/entities/schedule.entities';
import { Menus } from 'src/menu/entities/menu.entity';

@Entity()
export class Classrooms {
  @PrimaryGeneratedColumn({ name: 'class_id' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Schools, (school) => school.classes)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => Schedules, (schedule) => schedule.classroom)
  schedules: Schedules[];

  @OneToMany(() => Menus, (menu) => menu.classroom)
  menus: Menus[];
}
