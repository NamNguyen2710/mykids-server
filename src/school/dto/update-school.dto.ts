import { z } from 'zod';

export const UpdateSchoolSchema = z.object({
  name: z.string(),
  schoolAdminId: z.number(),
  logoId: z.number().optional(),
  brandColor: z.string().optional(),
});
export type UpdateSchoolDto = z.infer<typeof UpdateSchoolSchema>;
