import { CommentTaggedUser } from 'src/comment/entities/comment_tagged_user.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  id: number;

  @Column()
  message: string;

  @Column()
  createdById: number;

  @Column({ name: 'belonged_to_id' })
  belongedToId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Users, { eager: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: Users;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: 'belonged_to_id' })
  belongedTo: Posts;

  @OneToMany(() => CommentTaggedUser, (taggedUser) => taggedUser.comment, {
    eager: true,
    cascade: true,
  })
  taggedUsers: CommentTaggedUser[];
}
