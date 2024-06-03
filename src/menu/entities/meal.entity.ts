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
export class Meals {
  @PrimaryGeneratedColumn({ name: 'meal_id' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: MealType, nullable: true })
  type: MealType;

  @ManyToOne(() => Menus, (menu) => menu.meals)
  @JoinColumn({ name: 'menu_id' })
  menu: Menus;
}
