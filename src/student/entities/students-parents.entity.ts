import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Students } from 'src/student/entities/student.entity';
import { Parents } from 'src/users/entity/parent.entity';

@Entity({ name: 'students_parents' })
export class StudentsParents {
  @PrimaryColumn({ name: 'parent_id', type: 'int' })
  parentId: number;

  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column()
  relationship: string;

  @ManyToOne(() => Parents, (user) => user.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Parents;

  @ManyToOne(() => Students, (student) => student.parents)
  @JoinColumn({ name: 'student_id' })
  student: Students;
}
