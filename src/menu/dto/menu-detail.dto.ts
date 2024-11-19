import { z } from 'zod';
import { MealDetailSchema } from 'src/menu/dto/meal-detail.dto';
import { MealPeriod } from '../entities/menu.entity';

export const MenuDetailSchema = z.object({
  name: z.string({ invalid_type_error: 'Name must be a string' }).nullish(),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .nullish(),
  mealPeriod: z.nativeEnum(MealPeriod, {
    invalid_type_error: 'Meal Period must be a valid value',
  }),
  meals: z.array(MealDetailSchema, {
    invalid_type_error: 'Meals must be an array',
  }),
  date: z.coerce.date({ invalid_type_error: 'Date must be a valid date' }),
  classId: z
    .number({
      invalid_type_error: 'Class ID must be a number',
      required_error: 'Class ID is required',
    })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer'),
});
export type MenuDetail = z.infer<typeof MenuDetailSchema>;
