import { z } from 'zod';

export const CreateSchoolSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, { message: 'Name cannot be empty' }),
  logoId: z
    .number({ invalid_type_error: 'Logo ID must be a number' })
    .int({ message: 'Logo ID must be an integer' })
    .positive({ message: 'Logo ID must be a positive number' })
    .nullish(),
  brandColor: z
    .string({ invalid_type_error: 'Brand color must be a string' })
    .optional(),
});
export type CreateSchoolDto = z.infer<typeof CreateSchoolSchema>;
