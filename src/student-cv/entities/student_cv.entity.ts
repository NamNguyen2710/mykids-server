import { Students } from 'src/student/entities/student.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'student_cv' })
export class StudentCV {
  @PrimaryGeneratedColumn({ name: 'cv_id' })
  id: number;

  @Column({ name: 'cv_url' })
  url: string;

  @Column({ type: 'text', nullable: true })
  mimeType: string;

  @ManyToOne(() => Students)
  student: Students;
}
