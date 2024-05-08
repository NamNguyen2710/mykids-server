import { Posts } from 'src/post/entities/post.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  Entity,
} from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => Posts, (post) => post.comment)
  belongedTo: Posts;

  @OneToOne(() => Users)
  @JoinColumn()
  createdBy: Users;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToMany(() => Users)
  @JoinTable()
  taggedUsers: Users[];
}
