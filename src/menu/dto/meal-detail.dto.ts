import { MealType } from 'src/menu/entities/meal.entity';

export interface MealDetail {
  name: string;
  ingredients?: string;
  nutrition?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  type: MealType;
}
