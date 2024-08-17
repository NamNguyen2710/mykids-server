import { z } from 'zod';

export const CreateLoaSchema = z.object({
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  studentId: z.number(),
  classId: z.number(),
  assetIds: z.array(z.number()),
});

export type CreateLoaDto = z.infer<typeof CreateLoaSchema>;
