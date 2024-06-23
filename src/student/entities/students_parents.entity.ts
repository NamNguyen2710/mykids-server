import { Students } from 'src/student/entities/student.entity';
import { Users } from 'src/users/entity/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'comment_tagged_user' })
export class StudentsParents {
  @PrimaryColumn({ name: 'parent_id', type: 'int' })
  parentId: number;

  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column()
  relationship: string;

  @ManyToOne(() => Users, (user) => user.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Users;

  @ManyToOne(() => Students, (student) => student.parents)
  @JoinColumn({ name: 'student_id' })
  student: Students;
}
