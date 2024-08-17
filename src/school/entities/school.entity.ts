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
import { Assets } from 'src/asset/entities/asset.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Users } from 'src/users/entity/users.entity';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import { Students } from 'src/student/entities/student.entity';
import { Albums } from 'src/album/entities/album.entity';
import { Medicals } from 'src/medical/entities/medical.entity';

@Entity()
export class Schools {
  @PrimaryGeneratedColumn({ name: 'school_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  schoolAdminId: number;

  @OneToOne(() => Users, (admin) => admin.assignedSchool)
  @JoinColumn({ name: 'school_admin_id' })
  schoolAdmin: Users;

  @Column({ nullable: true })
  logoId: number;

  @OneToOne(() => Assets, { nullable: true, eager: true })
  @JoinColumn({ name: 'logo_id' })
  logo: Assets | null;

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

  @OneToMany(() => Albums, (album) => album.school)
  albums: Albums[];

  @OneToMany(() => Medicals, (medical) => medical.school)
  medicals: Medicals[];
}
