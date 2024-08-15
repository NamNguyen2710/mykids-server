import { z } from 'zod';
import { MealDetailSchema } from 'src/menu/dto/meal-detail.dto';
import { MealPeriod } from '../entities/menu.entity';

export const MenuDetailSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  mealPerioad: z.nativeEnum(MealPeriod),
  meals: z.array(MealDetailSchema),
  date: z.coerce.date(),
  classId: z.number(),
});
export type MenuDetail = z.infer<typeof MenuDetailSchema>;
