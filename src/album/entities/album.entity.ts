import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Schools } from 'src/school/entities/school.entity';
import { Classrooms } from 'src/class/entities/class.entity';
import { Users } from 'src/users/entity/users.entity';
import { Assets } from 'src/asset/entities/asset.entity';

@Entity()
export class Albums {
  @PrimaryGeneratedColumn({ name: 'album_id' })
  id: number;

  @Column()
  title: string;

  @Column()
  schoolId: number;

  @Column()
  createdById: number;

  @Column()
  classId: number;

  @ManyToOne(() => Schools, (school) => school.albums)
  school: Schools;

  @ManyToOne(() => Classrooms, (classrooms) => classrooms.albums)
  class: Classrooms;

  @ManyToOne(() => Users, (user) => user.albums)
  createdBy: Users;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  publishedDate: Date | null;

  @ManyToMany(() => Assets, (asset) => asset.albums, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'album_assets',
    joinColumn: { name: 'album_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'asset_id', referencedColumnName: 'id' },
  })
  assets: Assets[];
}
