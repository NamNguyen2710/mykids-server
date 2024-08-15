import { z } from 'zod';

export const CreateLoaSchema = z.object({
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  studentId: z.number(),
  classId: z.number(),
  assetIds: z.array(z.number()),
});

export type CreateLoaDto = z.infer<typeof CreateLoaSchema>;
