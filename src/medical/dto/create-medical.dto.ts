import { z } from 'zod';

export const CreateMedicalSchema = z.object({
  schoolId: z.number(),
  studentId: z.number(),
  assetIds: z.array(z.number()),
  history: z.string().optional(),
  currentMedication: z.string().optional(),
  allergies: z.string().optional(),
  vacinations: z.string().optional(),
  instruction: z.string().optional(),
});
export type CreateMedicalDto = z.infer<typeof CreateMedicalSchema>;
