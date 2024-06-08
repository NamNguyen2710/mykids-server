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
  AfterLoad,
} from 'typeorm';
import { Roles } from './roles.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Comments } from 'src/comment/entities/comment.entity';
import { Schools } from 'src/school/entities/school.entity';
import { CommentTaggedUser } from 'src/comment_tagged_user/entities/comment_tagged_user.entity';
import { Students } from 'src/student/entities/student.entity';

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
  otp: string;

  @Column({ nullable: true, type: 'timestamptz' })
  otpExpiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Posts, (post) => post.createdBy)
  createdPosts: Posts[];

  @ManyToMany(() => Posts, (post) => post.likedUsers)
  likedPosts: Posts[];

  @OneToMany(() => CommentTaggedUser, (comment) => comment.user)
  taggedComments: Comments[];

  @ManyToMany(() => Schools, (school) => school.parents)
  schools: Schools[];

  @ManyToMany(() => Students, (student) => student.parents)
  children: Students[];

  @AfterLoad()
  removeIds() {
    if (this.role) delete this.roleId;
  }
}
