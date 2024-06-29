import { Classrooms } from 'src/class/entities/class.entity';
import { Images } from 'src/image/entities/image.entity';
import { Students } from 'src/student/entities/student.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LOA_STATUS {
  PENDING = 'pending',
  APPROVE = 'approve',
  REJECT = 'reject',
  CANCEL = 'cancel',
}
@Entity()
export class Loa {
  @PrimaryGeneratedColumn({ name: 'loa_id' })
  id: number;

  @ManyToOne(() => Students, (student) => student.loas)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @ManyToOne(() => Classrooms, (classroom) => classroom.loas)
  @JoinColumn({ name: 'class_id' })
  classroom: Classrooms;

  @ManyToOne(() => Users, (users) => users.loa)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: Users;

  @ManyToMany(() => Images, (image) => image.loa)
  @JoinTable({
    name: 'loa_image',
    joinColumn: { name: 'loa_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  image: Images[];

  @Column()
  classId: number;

  @Column()
  studentId: number;

  @Column()
  createdById: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: LOA_STATUS, default: LOA_STATUS.PENDING })
  approveStatus: string;
}
