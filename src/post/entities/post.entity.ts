import { Comments } from 'src/comment/entities/comment.entity';
import { Hashtags } from 'src/post/entities/hashtag.entity';
import { Assets } from 'src/asset/entities/asset.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  id: number;

  @Column()
  message: string;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @Column({ name: 'school_id' })
  schoolId: number;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @ManyToOne(() => Schools, (school) => school.posts)
  school: Schools;

  @ManyToOne(() => Users, (user) => user.createdPosts, { eager: true })
  @JoinColumn()
  createdBy: Users;

  @OneToMany(() => Comments, (comment) => comment.belongedTo)
  comments: Comments[];

  @ManyToMany(() => Users, (user) => user.likedPosts)
  @JoinTable({
    name: 'post_likes',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  likedUsers: Users[];

  @ManyToMany(() => Hashtags, (hashtag) => hashtag.posts, {
    cascade: true,
  })
  @JoinTable({
    name: 'posts_hashtags_relation',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'hashtag_id' },
  })
  hashtags: Hashtags[];

  @ManyToMany(() => Assets, (asset) => asset.posts, { eager: true })
  @JoinTable({
    name: 'post_assets',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  assets: Assets[];
}
