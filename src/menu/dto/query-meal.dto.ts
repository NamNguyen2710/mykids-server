import { z } from 'zod';

export const QueryMealSchema = z.object({
  q: z.string({ invalid_type_error: 'Query must be a string' }).optional(),
});
export type QueryMealDto = z.infer<typeof QueryMealSchema>;
