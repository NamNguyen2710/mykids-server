import { z } from 'zod';

export const CreateSchoolSchema = z.object({
  name: z.string(),
  logoId: z.number().optional(),
  brandColor: z.string().optional(),
});
export type CreateSchoolDto = z.infer<typeof CreateSchoolSchema>;
