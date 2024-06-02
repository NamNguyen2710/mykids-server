import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'schedule_id' })
  id: number;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  location: string;
}
