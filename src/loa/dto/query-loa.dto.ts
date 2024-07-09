import { z } from 'zod';

export const QueryLoaSchema = z.object({
  studentId: z.coerce.number().optional(),
  classId: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export type QueryLoaDto = z.infer<typeof QueryLoaSchema>;
