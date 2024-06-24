import { Posts } from 'src/post/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hashtags {
  @PrimaryGeneratedColumn({ name: 'hashtag_id' })
  id: number;

  @Column()
  description: string;

  @ManyToMany(() => Posts, (post) => post.hashtags)
  posts: Posts[];
}
