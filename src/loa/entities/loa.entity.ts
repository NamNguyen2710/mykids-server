import { Classrooms } from 'src/class/entities/class.entity';
import { Students } from 'src/student/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LoaEntity {
  @PrimaryGeneratedColumn({ name: 'LOA_ID' })
  id: number;

  @JoinColumn({ name: 'student_id' })
  @ManyToOne(() => Students, (student) => student.loa)
  studentId: Students;

  @JoinColumn({ name: 'class_id' })
  @ManyToOne(() => Classrooms, (classroom) => classroom.loa)
  classId: Classrooms;

  @Column({ name: 'LOA_description' })
  description: String;

  @Column({ name: 'absent_from_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'absent_until_date', type: 'timestamptz' })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: false })
  approveStatus: boolean;
}
