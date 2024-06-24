import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Posts } from 'src/post/entities/post.entity';
import { Meals } from 'src/menu/entities/meal.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  id: number;

  @Column()
  url: string;

  @ManyToMany(() => Posts, (post) => post.photos)
  posts: Posts[];

  @ManyToMany(() => Meals, (meal) => meal.images)
  meals: Meals[];
}
