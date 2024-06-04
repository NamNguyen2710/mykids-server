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
export class SchoolYear {
  @PrimaryGeneratedColumn({ name: 'school_year_id' })
  id: number;

  @Column()
  year: string;

  @Column()
  isActive: boolean;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @ManyToOne(() => Schools, (school) => school.schoolYears)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => Classrooms, (classroom) => classroom.schoolYear)
  classes: Classrooms[];
}
