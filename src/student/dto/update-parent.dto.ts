import { z } from 'zod';

export const UpdateParentSchema = z.object({
  firstName: z
    .string({ invalid_type_error: 'First name must be a string' })
    .optional(),
  lastName: z
    .string({ invalid_type_error: 'Last name must be a string' })
    .optional(),
  phoneNumber: z
    .string({ invalid_type_error: 'Phone number must be a string' })
    .optional(),
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .email('Invalid email format')
    .optional(),
  profession: z
    .string({ invalid_type_error: 'Profession must be a string' })
    .optional(),
  relationship: z
    .string({ invalid_type_error: 'Relationship must be a string' })
    .optional(),
});
export type UpdateParentDto = z.infer<typeof UpdateParentSchema>;
