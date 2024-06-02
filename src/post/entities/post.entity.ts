import { Comments } from 'src/comment/entities/comment.entity';
import { Hashtags } from 'src/hashtag/entities/hashtag.entity';
import { Images } from 'src/image/entities/image.entity';
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

  @ManyToMany(() => Images, (photo) => photo.posts)
  @JoinTable({
    name: 'post_images',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  photos: Images[];

  @OneToMany(() => Comments, (comment) => comment.belongedTo)
  comments: Comments[];

  @ManyToOne(() => Users, (user) => user.createdPosts)
  @JoinColumn()
  createdBy: Users;

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

  @ManyToOne(() => Schools, (school) => school.posts)
  school: Schools;

  @ManyToMany(() => Users, (user) => user.likedPosts)
  @JoinTable({
    name: 'post_likes',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  likedUsers: Users[];

  @ManyToMany(() => Hashtags, (hashtag) => hashtag.posts)
  @JoinTable({
    name: 'posts_hashtags_relation',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'hashtag_id' },
  })
  hashtags: Hashtags[];

  likeCount: number;
  commentCount: number;
}
