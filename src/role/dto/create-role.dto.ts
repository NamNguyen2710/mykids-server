import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(1, 'Name cannot be empty'),
  schoolId: z
    .number({
      invalid_type_error: 'School ID must be a number',
      required_error: 'School ID is required',
    })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer'),
});
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
