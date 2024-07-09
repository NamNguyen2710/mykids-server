import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Posts } from 'src/post/entities/post.entity';
import { Meals } from 'src/menu/entities/meal.entity';
import { Loa } from 'src/loa/entities/loa.entity';
import { Album } from 'src/album/entities/album.entity';

@Entity()
export class Assets {
  @PrimaryGeneratedColumn({ name: 'asset_id' })
  id: number;

  @Column()
  url: string;

  @Column()
  albumId: number;

  @ManyToMany(() => Posts, (post) => post.assets)
  posts: Posts[];

  @ManyToMany(() => Meals, (meal) => meal.assets)
  meals: Meals[];

  @ManyToMany(() => Loa, (loa) => loa.assets)
  loas: Loa[];

  @ManyToOne(() => Album, (album) => album.assets)
  album: Album;
}
