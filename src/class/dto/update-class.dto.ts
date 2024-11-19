import { z } from 'zod';

export const UpdateClassSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Class name must be a string' })
    .min(1, 'Class name cannot be empty')
    .optional(),
  location: z
    .string({ invalid_type_error: 'Location must be a string' })
    .optional(),
});
export type UpdateClassDto = z.infer<typeof UpdateClassSchema>;
