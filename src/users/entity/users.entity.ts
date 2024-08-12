import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Roles } from './roles.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Schools } from 'src/school/entities/school.entity';
import { CommentTaggedUser } from 'src/comment/entities/comment_tagged_user.entity';
import { Notifications } from 'src/notifications/entities/notification.entity';
import { Loa } from 'src/loa/entities/loa.entity';
import { StudentsParents } from 'src/student/entities/students-parents.entity';
import { Albums } from 'src/album/entities/album.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column()
  roleId: number;

  @ManyToOne(() => Roles, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, type: 'timestamptz' })
  otpExpiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => Schools, (school) => school.schoolAdmin)
  assignedSchool: Schools;

  @OneToMany(() => Posts, (post) => post.createdBy)
  createdPosts: Posts[];

  @ManyToMany(() => Posts, (post) => post.likedUsers)
  likedPosts: Posts[];

  @OneToMany(() => CommentTaggedUser, (comment) => comment.user)
  taggedComments: CommentTaggedUser[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];

  @ManyToMany(() => Schools, (school) => school.parents)
  schools: Schools[];

  @OneToMany(() => StudentsParents, (student) => student.parent)
  children: StudentsParents[];

  @OneToMany(() => Albums, (album) => album.createdBy)
  albums: Albums[];

  @OneToMany(() => Loa, (loa) => loa.createdBy)
  loa: Loa[];
}
