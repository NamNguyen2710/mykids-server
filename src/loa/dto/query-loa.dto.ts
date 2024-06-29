import { z } from 'zod';

export const QueryLoaSchema = z.object({
  studentId: z.number().optional(),
  classId: z.number().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export type QueryLoaDto = z.infer<typeof QueryLoaSchema>;
