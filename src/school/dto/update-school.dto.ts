import { z } from 'zod';

export const UpdateSchoolSchema = z.object({
  name: z.string({ invalid_type_error: 'Name must be a string' }).optional(),
  logoId: z
    .number({ invalid_type_error: 'Logo ID must be a number' })
    .int({ message: 'Logo ID must be an integer' })
    .positive({ message: 'Logo ID must be a positive number' })
    .nullish(),
  brandColor: z
    .string({ invalid_type_error: 'Brand color must be a string' })
    .optional(),
});
export type UpdateSchoolDto = z.infer<typeof UpdateSchoolSchema>;
