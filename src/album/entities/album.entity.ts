import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assets } from 'src/asset/entities/asset.entity';
import { Schools } from 'src/school/entities/school.entity';
// import { Users } from 'src/users/entity/users.entity';
// import { Students } from 'src/student/entities/student.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn({ name: 'album_id' })
  id: number;

  @Column({ name: 'school_id' })
  schoolId: number;

  //   @Column({ name: 'student_id' })
  //   student_id: number;

  //   @ManyToOne(() => Students, (student) => student.album)
  //   student: Students;

  @ManyToOne(() => Schools, (school) => school.album)
  school: Schools;

  @OneToMany(() => Assets, (asset) => asset.album)
  assets: Assets;
}
