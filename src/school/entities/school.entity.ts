import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classrooms } from 'src/class/entities/class.entity';
import { Images } from 'src/image/entities/image.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Users } from 'src/users/entity/users.entity';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import { Students } from 'src/student/entities/student.entity';

@Entity()
export class Schools {
  @PrimaryGeneratedColumn({ name: 'school_id' })
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Users)
  @JoinColumn()
  schoolAdmin: Users;

  @OneToOne(() => Images, { nullable: true })
  @JoinColumn()
  logo: Images | null;

  @Column({ nullable: true })
  brandColor: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Posts, (post) => post.school)
  posts: Posts[];

  @ManyToMany(() => Users, (user) => user.schools)
  @JoinTable({
    name: 'school_parents',
    joinColumn: { name: 'school_id' },
    inverseJoinColumn: { name: 'parent_id' },
  })
  parents: Users[];

  @OneToMany(() => SchoolYears, (schoolYear) => schoolYear.school)
  schoolYears: SchoolYears[];

  @OneToMany(() => Classrooms, (classroom) => classroom.school)
  classes: Classrooms[];

  @OneToMany(() => Students, (student) => student.school)
  students: Students[];
}
