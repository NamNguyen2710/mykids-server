import { z } from 'zod';

export const UpdateMedicalSchema = z.object({
  assetIds: z.array(z.number()).optional(),
  history: z.string().optional(),
  currentMedication: z.string().optional(),
  allergies: z.string().optional(),
  vacinations: z.string().optional(),
  instruction: z.string().optional(),
});
export type UpdateMedicalDto = z.infer<typeof UpdateMedicalSchema>;
