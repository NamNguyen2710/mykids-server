import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assets } from 'src/asset/entities/asset.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Users } from 'src/users/entity/users.entity';
// import { Users } from 'src/users/entity/users.entity';
// import { Students } from 'src/student/entities/student.entity';

@Entity()
export class Albums {
  @PrimaryGeneratedColumn({ name: 'album_id' })
  id: number;

  @Column({ name: 'school_id' })
  schoolId: number;

  @Column({ name: 'created_by_id' })
  createdById: number;

  //   @Column({ name: 'student_id' })
  //   student_id: number;

  //   @ManyToOne(() => Students, (student) => student.album)
  //   student: Students;

  @ManyToOne(() => Schools, (school) => school.album)
  school: Schools;

  @ManyToOne(() => Users, (user) => user.createdAlbum)
  createdBy: Users;

  @ManyToMany(() => Assets, (asset) => asset.album)
  @JoinTable({
    name: 'album_image',
    joinColumn: { name: 'album_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  assets: Assets[];
}
