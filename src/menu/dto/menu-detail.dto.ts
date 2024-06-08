import { MealDetail } from 'src/menu/dto/meal-detail.dto';
import { MealPeriod } from '../entities/menu.entity';

export interface MenuDetail {
  name: string;
  description?: string;
  mealPerioad: MealPeriod;
  meals: MealDetail[];
  date: Date;
  classId: number;
}
