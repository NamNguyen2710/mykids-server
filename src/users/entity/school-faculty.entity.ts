import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Loa } from 'src/loa/entities/loa.entity';
import { Users } from 'src/users/entity/users.entity';
import { Albums } from 'src/album/entities/album.entity';
import { Schools } from 'src/school/entities/school.entity';
import { WorkHistories } from 'src/work-history/entities/work-history.entity';

@Entity()
export class SchoolFaculties {
  @PrimaryColumn({ name: 'user_id', type: 'int' })
  userId: number;

  @OneToOne(() => Users, (user) => user.faculty, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  schoolId: number;

  @ManyToOne(() => Schools, (school) => school.faculties)
  @JoinColumn({ name: 'school_id' })
  assignedSchool: Schools;

  @OneToMany(() => WorkHistories, (workHistory) => workHistory.faculty)
  history: WorkHistories[];

  @OneToMany(() => Albums, (album) => album.createdBy)
  albums: Albums[];

  @OneToMany(() => Loa, (loa) => loa.reviewer)
  loas: Loa[];
}
