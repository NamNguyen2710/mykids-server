import { CommentTaggedUser } from 'src/comment_tagged_user/entities/comment_tagged_user.entity';
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

  @ManyToOne(() => Users)
  @JoinColumn()
  createdBy: Users;

  @ManyToOne(() => Posts)
  @JoinColumn()
  belongedTo: Posts;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => CommentTaggedUser, (taggedUser) => taggedUser.comment)
  taggedUsers: CommentTaggedUser[];
}
