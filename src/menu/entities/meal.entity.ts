import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  AfterLoad,
} from 'typeorm';

import { Menus } from 'src/menu/entities/menu.entity';
import { Images } from 'src/image/entities/image.entity';

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
  ingredients: string;

  @Column({ nullable: true })
  nutrition: string;

  @Column({ nullable: true })
  isVegetarian: boolean;

  @Column({ nullable: true })
  isGlutenFree: boolean;

  @Column({ type: 'enum', enum: MealType, nullable: true })
  type: MealType;

  @Column()
  menuId: number;

  @ManyToOne(() => Menus, (menu) => menu.meals, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'menu_id' })
  menu: Menus;

  @ManyToMany(() => Images, (image) => image.meals, { eager: true })
  @JoinTable({
    name: 'meal_images',
    joinColumn: { name: 'meal_id' },
    inverseJoinColumn: { name: 'image_id' },
  })
  images: Images[];

  @AfterLoad()
  removeIds() {
    if (this.menu) delete this.menuId;
  }
}
