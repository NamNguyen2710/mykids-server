import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Schools } from 'src/school/entities/school.entity';
import { Schedules } from 'src/schedule/entities/schedule.entity';
import { Menus } from 'src/menu/entities/menu.entity';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import { ClassHistories } from 'src/class-history/entities/class-history.entity';

@Entity()
export class Classrooms {
  @PrimaryGeneratedColumn({ name: 'class_id' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  isActive: boolean;

  @Column()
  schoolId: number;

  @Column()
  schoolYearId: number;

  @ManyToOne(() => Schools, (school) => school.classes)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @ManyToOne(() => SchoolYears, (schoolYear) => schoolYear.classes)
  @JoinColumn({ name: 'school_year_id' })
  schoolYear: SchoolYears;

  @OneToMany(() => Schedules, (schedule) => schedule.classroom)
  schedules: Schedules[];

  @OneToMany(() => Menus, (menu) => menu.classroom)
  menus: Menus[];

  @OneToMany(() => ClassHistories, (history) => history.classroom)
  students: ClassHistories[];

  // Listeners
  @AfterLoad()
  removeIds() {
    if (this.school) delete this.schoolId;
    if (this.schoolYear) delete this.schoolYearId;
  }
}
