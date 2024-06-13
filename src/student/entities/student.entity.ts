import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Schools } from 'src/school/entities/school.entity';
import { Users } from 'src/users/entity/users.entity';
import { ClassHistories } from 'src/class-history/entities/class-history.entity';

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

  @ManyToMany(() => Users, (user) => user.children)
  @JoinTable({
    name: 'children_parents',
    joinColumn: { name: 'student_id' },
    inverseJoinColumn: { name: 'parent_id' },
  })
  parents: Users[];

  @ManyToOne(() => Schools, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => ClassHistories, (history) => history.student)
  history: ClassHistories[];

  @AfterLoad()
  removeIds() {
    if (this.school) delete this.schoolId;
  }
}
