import { z } from 'zod';

export const CreateMedicalSchema = z.object({
  schoolId: z.number(),
  assetIds: z.array(z.number()),
  history: z.string().optional(),
  currentMedication: z.string().optional(),
  allergies: z.string().optional(),
  vaccinations: z.string().optional(),
  instruction: z.string().optional(),
});
export type CreateMedicalDto = z.infer<typeof CreateMedicalSchema>;
