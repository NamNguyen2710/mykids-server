import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToOne,
} from 'typeorm';

import { Schools } from 'src/school/entities/school.entity';
import { ClassHistories } from 'src/class/entities/class-history.entity';
import { Loa } from 'src/loa/entities/loa.entity';
import { StudentsParents } from 'src/student/entities/students-parents.entity';
import { Assets } from 'src/asset/entities/asset.entity';
import { Medicals } from 'src/medical/entities/medical.entity';

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

  @Column({ nullable: true })
  logoId: number;

  @OneToOne(() => Assets, { eager: true, cascade: true })
  @JoinColumn({ name: 'logo_id' })
  logo: Assets;

  @OneToMany(() => StudentsParents, (parent) => parent.student)
  parents: StudentsParents[];

  @ManyToOne(() => Schools, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @OneToMany(() => ClassHistories, (history) => history.student)
  history: ClassHistories[];

  @OneToMany(() => Loa, (loa) => loa.studentId)
  loas: Loa[];

  @ManyToMany(() => Assets, (asset) => asset.students, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'student_cvs',
    joinColumn: { name: 'student_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'asset_id', referencedColumnName: 'id' },
  })
  studentCvs: Assets[];

  @OneToMany(() => Medicals, (medical) => medical.student)
  medicals: Medicals[];
}
