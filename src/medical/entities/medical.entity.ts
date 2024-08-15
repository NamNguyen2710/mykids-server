import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Assets } from 'src/asset/entities/asset.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Students } from 'src/student/entities/student.entity';

@Entity()
export class Medicals {
  @PrimaryGeneratedColumn({ name: 'medical_id' })
  id: number;

  @Column({ name: 'school_id' })
  schoolId: number;

  @ManyToOne(() => Schools, (school) => school.medicals)
  school: Schools;

  @ManyToMany(() => Assets, (asset) => asset.medical)
  assets: Assets[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Students, (student) => student.medicals)
  student: Students;
}
