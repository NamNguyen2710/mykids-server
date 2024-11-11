import { z } from 'zod';

export const QueryMealSchema = z.object({
  q: z.string().optional(),
});
export type QueryMealDto = z.infer<typeof QueryMealSchema>;
