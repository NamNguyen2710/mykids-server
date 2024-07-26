import { Assets } from 'src/asset/entities/asset.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Students } from 'src/student/entities/student.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Medicals {
  @PrimaryGeneratedColumn({ name: 'medical_id' })
  id: number;

  @ManyToOne(() => Schools, (school) => school.medicals)
  school: Schools;

  @OneToMany(() => Assets, (asset) => asset.medical)
  assets: Assets[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Students, (student) => student.medicals)
  student: Students;
}
