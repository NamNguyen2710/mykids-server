import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Schools } from 'src/school/entities/school.entity';
import { ClassHistories } from 'src/class-history/entities/class-history.entity';
import { Loa } from 'src/loa/entities/loa.entity';
import { StudentsParents } from 'src/student/entities/students_parents.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Students {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  permanentAddress: string;

  @Column()
  currentAddress: string;

  @Column()
  ethnic: string;

  @Column()
  birthPlace: string;

  @Column({ type: 'enum', enum: Gender })
  gender: string;

  @Column({ nullable: true })
  information: string;

  @Column()
  isActive: boolean;

  @Column()
  schoolId: number;

  @OneToMany(() => StudentsParents, (parent) => parent.student)
  parents: StudentsParents[];

  @ManyToOne(() => Schools, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => ClassHistories, (history) => history.student)
  history: ClassHistories[];

  @OneToMany(() => Loa, (loa) => loa.studentId)
  loa: Loa[];
}
