import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
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

  @Column({ nullable: true })
  classId: number;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => Schools, (school) => school.albums)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @ManyToOne(() => Classrooms, (classrooms) => classrooms.albums, {
    nullable: true,
  })
  @JoinColumn({ name: 'class_id' })
  classroom: Classrooms;

  @ManyToOne(() => SchoolFaculties, (user) => user.albums)
  @JoinColumn({ name: 'created_by_id' })
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
