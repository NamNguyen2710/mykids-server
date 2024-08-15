import { z } from 'zod';

export const CreateMedicalSchema = z.object({
  schoolId: z.number(),
  studentId: z.number(),
  assetIds: z.array(z.number()),
});
export type CreateMedicalDto = z.infer<typeof CreateMedicalSchema>;
