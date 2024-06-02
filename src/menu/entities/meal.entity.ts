import { Menus } from 'src/menu/entities/menu.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum MealType {
  APPETIZER = 'appetizer',
  MAIN = 'main',
  SIDE = 'side',
  VEGIE = 'vegetable',
  SOUP = 'soup',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
  OTHER = 'other',
}

@Entity()
export class Meal {
  @PrimaryGeneratedColumn({ name: 'meal_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: MealType })
  type: MealType;

  @ManyToOne(() => Menus, (menu) => menu.meals)
  @JoinColumn({ name: 'menu_id' })
  menu: Menus;
}
