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
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import { Students } from 'src/student/entities/student.entity';
import { Albums } from 'src/album/entities/album.entity';
import { Medicals } from 'src/medical/entities/medical.entity';
import { SchoolFaculties } from 'src/users/entity/school-faculty.entity';
import { Parents } from 'src/users/entity/parent.entity';
import { Roles } from 'src/role/entities/roles.entity';

@Entity()
export class Schools {
  @PrimaryGeneratedColumn({ name: 'school_id' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SchoolFaculties, (faculty) => faculty.assignedSchool)
  faculties: SchoolFaculties[];

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

  @ManyToMany(() => Parents, (user) => user.schools)
  @JoinTable({
    name: 'school_parents',
    joinColumn: { name: 'school_id' },
    inverseJoinColumn: { name: 'parent_id' },
  })
  parents: Parents[];

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

  @OneToMany(() => Roles, (role) => role.school)
  roles: Roles[];
}
