import { Images } from 'src/image/entities/image.entity';
import { Posts } from 'src/post/entities/post.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Schools {
  @PrimaryGeneratedColumn({ name: 'school_id' })
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Users)
  @JoinColumn()
  schoolAdmin: Users;

  @OneToOne(() => Images, { nullable: true })
  @JoinColumn()
  logo: Images | null;

  @Column({ nullable: true })
  brandColor: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Posts, (post) => post.school)
  posts: Posts[];

  @ManyToMany(() => Users)
  @JoinTable({
    name: 'school_parents',
    joinColumn: { name: 'school_id' },
    inverseJoinColumn: { name: 'parent_id' },
  })
  parents: Users[];
}
