import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Loa } from 'src/loa/entities/loa.entity';
import { Users } from 'src/users/entity/users.entity';
import { Schools } from 'src/school/entities/school.entity';
import { StudentsParents } from 'src/student/entities/students-parents.entity';

@Entity()
export class Parents {
  @PrimaryColumn({ name: 'user_id', type: 'int' })
  userId: number;

  @OneToOne(() => Users, (user) => user.parent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ nullable: true })
  profession: string;

  @OneToMany(() => StudentsParents, (child) => child.parent)
  children: StudentsParents[];

  @ManyToMany(() => Schools, (school) => school.parents)
  schools: Schools[];

  @OneToMany(() => Loa, (loa) => loa.createdBy)
  loas: Loa[];
}
