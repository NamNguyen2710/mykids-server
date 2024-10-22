import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classrooms } from 'src/class/entities/class.entity';
import { Assets } from 'src/asset/entities/asset.entity';
import { Students } from 'src/student/entities/student.entity';
import { Parents } from 'src/users/entity/parent.entity';

export enum LOA_STATUS {
  PENDING = 'pending',
  APPROVE = 'approve',
  REJECT = 'reject',
  CANCEL = 'cancel',
}
@Entity()
export class Loa {
  @PrimaryGeneratedColumn({ name: 'loa_id' })
  id: number;

  @ManyToOne(() => Students, (student) => student.loas)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @ManyToOne(() => Classrooms, (classroom) => classroom.loas)
  @JoinColumn({ name: 'class_id' })
  classroom: Classrooms;

  @ManyToOne(() => Parents, (users) => users.loa)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: Parents;

  @ManyToMany(() => Assets, (asset) => asset.loas, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'loa_image',
    joinColumn: { name: 'loa_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  assets: Assets[];

  @Column()
  classId: number;

  @Column()
  studentId: number;

  @Column()
  createdById: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: LOA_STATUS, default: LOA_STATUS.PENDING })
  approveStatus: string;
}
