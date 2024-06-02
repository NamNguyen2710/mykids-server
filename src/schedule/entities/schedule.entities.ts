import { Classrooms } from 'src/class/entities/class.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Schedules {
  @PrimaryGeneratedColumn({ name: 'schedule_id' })
  id: number;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => Classrooms, (classes) => classes.schedules)
  classroom: Classrooms;
}
