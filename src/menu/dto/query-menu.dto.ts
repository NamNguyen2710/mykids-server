import { z } from 'zod';

export const QueryMenuSchema = z.object({
  classId: z.number(),
  date: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type QueryMenuDto = z.infer<typeof QueryMenuSchema>;
