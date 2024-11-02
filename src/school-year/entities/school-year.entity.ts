import { Classrooms } from 'src/class/entities/class.entity';
import { Schools } from 'src/school/entities/school.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SchoolYears {
  @PrimaryGeneratedColumn({ name: 'school_year_id' })
  id: number;

  @Column()
  year: string;

  @Column()
  isActive: boolean;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  schoolId: number;

  @ManyToOne(() => Schools, (school) => school.schoolYears)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => Classrooms, (classroom) => classroom.schoolYear)
  classes: Classrooms[];
}
