import { z } from 'zod';

export const CreateParentSchema = z.object({
  id: z
    .number({ invalid_type_error: 'ID must be a number' })
    .int('ID must be an integer')
    .positive('ID must be a positive integer')
    .optional(),
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(1, 'First name must not be empty'),
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, 'Last name must not be empty'),
  roleId: z.literal(3),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number must be a string',
    })
    .min(1, 'Phone number must not be empty'),
  email: z.string().optional(),
  profession: z.string().optional(),
  relationship: z
    .string({
      required_error: 'Relationship is required',
      invalid_type_error: 'Relationship must be a string',
    })
    .min(1, 'Relationship must not be empty'),
  logoId: z
    .number({ invalid_type_error: 'Logo ID must be a number' })
    .int('Logo ID must be an integer')
    .positive('Logo ID must be a positive integer')
    .optional(),
});

export type CreateParentDto = z.infer<typeof CreateParentSchema>;
