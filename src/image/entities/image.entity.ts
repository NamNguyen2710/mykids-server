import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Menus } from 'src/menu/entities/menu.entity';
import { Posts } from 'src/post/entities/post.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  id: number;

  @Column()
  url: string;

  @ManyToMany(() => Posts, (post) => post.photos)
  posts: Posts[];

  @ManyToMany(() => Menus, (menu) => menu.images)
  menus: Menus[];
}
