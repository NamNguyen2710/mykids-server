import { Posts } from 'src/post/entities/post.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Images {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Posts, (post) => post.photos, { nullable: true })
  post: Posts | null;
}
