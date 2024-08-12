import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Posts } from 'src/post/entities/post.entity';
import { Meals } from 'src/menu/entities/meal.entity';
import { Loa } from 'src/loa/entities/loa.entity';
import { Albums } from 'src/album/entities/album.entity';
import { Students } from 'src/student/entities/student.entity';

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

  @ManyToMany(() => Albums, (album) => album.assets)
  albums: Albums[];

  @ManyToMany(() => Students, (student) => student.studentCvs)
  students: Students[];
}
