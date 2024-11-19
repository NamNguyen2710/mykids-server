import { z } from 'zod';
import { MealType } from 'src/menu/entities/meal.entity';

export const MealDetailSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(1, 'Name cannot be empty'),
  ingredients: z
    .string({ invalid_type_error: 'Ingredients must be a string' })
    .nullish(),
  nutrition: z
    .string({ invalid_type_error: 'Nutrition must be a string' })
    .nullish(),
  isVegetarian: z
    .boolean({ invalid_type_error: 'IsVegetarian must be a boolean' })
    .nullish(),
  isGlutenFree: z
    .boolean({ invalid_type_error: 'IsGlutenFree must be a boolean' })
    .nullish(),
  type: z.nativeEnum(MealType).nullish(),
});
export type MealDetail = z.infer<typeof MealDetailSchema>;
