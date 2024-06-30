import { z } from 'zod';

export const QuerySchoolSchema = z.object({
  name: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});
export type QuerySchoolDto = z.infer<typeof QuerySchoolSchema>;
