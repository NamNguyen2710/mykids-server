import { Classrooms } from 'src/class/entities/class.entity';
import { SchoolFaculties } from 'src/users/entity/school-faculty.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WorkHistories {
  @PrimaryGeneratedColumn({ name: 'work_id' })
  id: number;

  @Column({ name: 'class_id', type: 'int' })
  classId: number;

  @Column({ name: 'faculty_id', type: 'int' })
  facultyId: number;

  @ManyToOne(() => Classrooms, (classroom) => classroom.students)
  @JoinColumn({ name: 'class_id' })
  classroom: Classrooms;

  @ManyToOne(() => SchoolFaculties, (faculty) => faculty.history)
  @JoinColumn({ name: 'student_id' })
  faculty: SchoolFaculties;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;
}
