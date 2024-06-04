import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Schools } from 'src/school/entities/school.entity';
import { Users } from 'src/users/entity/users.entity';
import { ClassHistory } from 'src/class-history/entities/class-history.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: number;

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

  @ManyToOne(() => Users, (user) => user.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Users;

  @ManyToOne(() => Schools, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => ClassHistory, (history) => history.student)
  history: ClassHistory[];
}
