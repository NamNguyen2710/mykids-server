import { z } from 'zod';

export const QueryMenuSchema = z.object({
  date: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type QueryMenuDto = z.infer<typeof QueryMenuSchema>;
