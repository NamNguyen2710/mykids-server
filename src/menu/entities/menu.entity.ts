import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Meal } from './meal.entity';
import { Images } from 'src/image/entities/image.entity';
import { Classrooms } from 'src/class/entities/class.entity';

export enum MealPeriod {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Supper = 'supper',
  Dinner = 'dinner',
}

@Entity()
export class Menus {
  @PrimaryGeneratedColumn({ name: 'meal_id' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: MealPeriod })
  mealPeriod: MealPeriod;

  @OneToMany(() => Meal, (meal) => meal.menu)
  meals: Meal[];

  @ManyToOne(() => Classrooms, (classroom) => classroom.menus)
  @JoinTable({ name: 'menu_classroom' })
  classroom: Classrooms;

  @ManyToMany(() => Images, (image) => image.menus)
  @JoinTable({
    name: 'menu_images',
    joinColumn: { name: 'menu_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  images: Images[];
}
