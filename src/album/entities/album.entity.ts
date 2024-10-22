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
import { Assets } from 'src/asset/entities/asset.entity';
import { SchoolFaculties } from 'src/users/entity/school-faculty.entity';

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

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => Schools, (school) => school.albums)
  school: Schools;

  @ManyToOne(() => Classrooms, (classrooms) => classrooms.albums)
  class: Classrooms;

  @ManyToOne(() => SchoolFaculties, (user) => user.albums)
  createdBy: SchoolFaculties;

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
