import { Classrooms } from 'src/class/entities/class.entity';
import { Students } from 'src/student/entities/student.entity';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class ClassHistories {
  @PrimaryColumn({ name: 'class_id', type: 'int' })
  classId: number;

  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @ManyToOne(() => Classrooms, (classroom) => classroom.students)
  @JoinColumn({ name: 'class_id' })
  classroom: Classrooms;

  @ManyToOne(() => Students, (student) => student.history)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @Column()
  description: string;

  @AfterLoad()
  removeIds() {
    if (this.classroom) delete this.classId;
    if (this.student) delete this.studentId;
  }
}
