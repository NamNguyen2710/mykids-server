import { z } from 'zod';

export const CreateClassSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name cannot be empty')
    .max(60),
  location: z
    .string({ invalid_type_error: 'Location must be a string' })
    .max(255)
    .optional(),
  schoolYearId: z
    .number({
      required_error: 'School Year ID is required',
      invalid_type_error: 'School Year ID must be a number',
    })
    .int('School Year ID must be an integer')
    .positive('School Year ID must be positive'),
});
export type CreateClassDto = z.infer<typeof CreateClassSchema>;
