import { z } from 'zod';

export const QueryMenuSchema = z.object({
  classId: z.number(),
  date: z.string().optional(),
});

export type QueryMenuDto = z.infer<typeof QueryMenuSchema>;
