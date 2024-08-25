import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import { Assets } from 'src/asset/entities/asset.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Students } from 'src/student/entities/student.entity';

@Entity({ name: 'medicals' })
export class Medicals {
  @PrimaryGeneratedColumn({ name: 'medical_id' })
  id: number;

  @Column({ name: 'school_id' })
  schoolId: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ default: '' })
  history: string;

  @Column({ default: '' })
  currentMedication: string;

  @Column({ default: '' })
  allergies: string;

  @Column({ default: '' })
  vaccinations: string;

  @Column({ default: '' })
  instruction: string;

  @ManyToOne(() => Schools, (school) => school.medicals)
  school: Schools;

  @ManyToMany(() => Assets, (asset) => asset.medicals, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'medical_assets',
    joinColumn: { name: 'medical_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'asset_id', referencedColumnName: 'id' },
  })
  assets: Assets[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Students, (student) => student.medicals)
  student: Students;
}
