import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Meal } from './meal.entity';
import { Images } from 'src/image/entities/image.entity';

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

  @Column()
  description: string;

  @Column({ type: 'enum', enum: MealPeriod })
  mealPeriod: MealPeriod;

  @OneToMany(() => Meal, (meal) => meal.menu)
  meals: Meal[];

  @ManyToMany(() => Images, (image) => image.menus)
  @JoinTable({
    name: 'menu_images',
    joinColumn: { name: 'menu_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  images: Images[];
}
