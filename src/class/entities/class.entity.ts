import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Schools } from 'src/school/entities/school.entity';

@Entity()
export class Classes {
  @PrimaryGeneratedColumn({ name: 'class_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  grade: string;

  @Column()
  location: string;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Schools, (school) => school.classes)
  @JoinColumn({ name: 'school_id' })
  school: Schools;
}
