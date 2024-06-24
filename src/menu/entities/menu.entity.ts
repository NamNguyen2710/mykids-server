import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Meals } from './meal.entity';
import { Classrooms } from 'src/class/entities/class.entity';

export enum MealPeriod {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Supper = 'supper',
  Dinner = 'dinner',
}

@Entity()
export class Menus {
  @PrimaryGeneratedColumn({ name: 'menu_id' })
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: MealPeriod })
  mealPeriod: MealPeriod;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  classId: number;

  @OneToMany(() => Meals, (meal) => meal.menu, {
    eager: true,
    cascade: true,
  })
  meals: Meals[];

  @ManyToOne(() => Classrooms, (classroom) => classroom.menus)
  @JoinColumn({ name: 'class_id' })
  classroom: Classrooms;
}
