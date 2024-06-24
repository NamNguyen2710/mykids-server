import { z } from 'zod';
import { MealType } from 'src/menu/entities/meal.entity';

export const MealDetailSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  ingredients: z.string().nullish(),
  nutrition: z.string().nullish(),
  isVegetarian: z.boolean().nullish(),
  isGlutenFree: z.boolean().nullish(),
  type: z.nativeEnum(MealType).nullish(),
});
export type MealDetail = z.infer<typeof MealDetailSchema>;
