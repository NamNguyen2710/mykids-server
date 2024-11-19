import { z } from 'zod';

export const UpdateParentProfileSchema = z.object({
  firstName: z
    .string({ invalid_type_error: 'First name must be a string' })
    .min(1, 'First name cannot be empty')
    .max(50)
    .optional(),
  lastName: z
    .string({ invalid_type_error: 'Last name must be a string' })
    .min(1, 'Last name cannot be empty')
    .max(50)
    .optional(),
  phoneNumber: z
    .string({ invalid_type_error: 'Phone number must be a string' })
    .min(1, 'Phone number cannot be empty')
    .max(15)
    .optional(),
  profession: z
    .string({ invalid_type_error: 'Profession must be a string' })
    .max(200)
    .optional(),
});
export type UpdateParentProfileDto = z.infer<typeof UpdateParentProfileSchema>;
