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
import { Roles } from 'src/role/entities/roles.entity';
import { Posts } from 'src/post/entities/post.entity';
import { CommentTaggedUser } from 'src/comment/entities/comment_tagged_user.entity';
import { Notifications } from 'src/notifications/entities/notification.entity';
import { Assets } from 'src/asset/entities/asset.entity';
import { Parents } from 'src/users/entity/parent.entity';
import { SchoolFaculties } from 'src/users/entity/school-faculty.entity';
import { NotificationToken } from 'src/notifications/entities/notification-token.entity';

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

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, type: 'timestamptz' })
  otpExpiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true })
  logoId: number;

  @OneToOne(() => Assets, (asset) => asset.userLogo, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'logo_id' })
  logo: Assets;

  @OneToOne(() => Parents, (parent) => parent.user, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  parent: Parents;

  @OneToOne(() => SchoolFaculties, (faculty) => faculty.user, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  faculty: SchoolFaculties;

  @OneToMany(() => Posts, (post) => post.createdBy)
  createdPosts: Posts[];

  @ManyToMany(() => Posts, (post) => post.likedUsers)
  likedPosts: Posts[];

  @OneToMany(() => CommentTaggedUser, (comment) => comment.user)
  taggedComments: CommentTaggedUser[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];

  @OneToMany(() => NotificationToken, (notiToken) => notiToken.user)
  notiTokens: NotificationToken[];
}
