import { Classrooms } from 'src/class/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class ClassHistory {
  @ManyToOne(() => Classrooms, (classroom) => classroom.students)
  @JoinColumn({ name: 'class_id' })
  @PrimaryColumn({ name: 'class_id', type: 'int' })
  classes: Classrooms;

  @ManyToOne(() => Student, (student) => student.history)
  @JoinColumn({ name: 'student_id' })
  @PrimaryColumn({ name: 'student_id', type: 'int' })
  student: Student;

  @Column()
  description: string;
}
