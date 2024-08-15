import { z } from 'zod';

export const UpdateMedicalSchema = z.object({
  assetIds: z.array(z.number()),
});
export type UpdateMedicalDto = z.infer<typeof UpdateMedicalSchema>;
