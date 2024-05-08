import { Comments } from 'src/comment/entities/comment.entity';
import { Hashtags } from 'src/hashtag/entities/hashtag.entity';
import { Images } from 'src/image/entities/image.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => Images, (photo) => photo.post)
  photos: Images[];

  @ManyToOne(() => Users, (user) => user.createdPosts)
  createdBy: Users;

  @OneToMany(() => Comments, (comment) => comment.belongedTo)
  comment: Comments[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz' })
  publishedAt: Date;

  @ManyToOne(() => Schools, (school) => school.posts)
  school: Schools;

  @ManyToMany(() => Users, (user) => user.likedPosts)
  @JoinTable({ name: 'post_likes' })
  likedUsers: Users[];

  @ManyToMany(() => Hashtags, (hashtag) => hashtag.posts)
  @JoinTable()
  hashtags: Hashtags[];
}
