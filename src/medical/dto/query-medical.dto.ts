import { z } from 'zod';

export const QueryMedicalSchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
});
export type QueryMedicalDTO = z.infer<typeof QueryMedicalSchema>;
