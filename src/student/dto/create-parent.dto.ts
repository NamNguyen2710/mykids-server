import { z } from 'zod';

export const CreateParentSchema = z.object({
  id: z.number().optional(),
  firstName: z.string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last name must be a string',
  }),
  roleId: z.literal(3, {
    invalid_type_error: 'Role ID must be 3',
  }),
  phoneNumber: z.string({
    required_error: 'Phone number is required',
    invalid_type_error: 'Phone number must be a string',
  }),
  email: z.string().optional(),
  profession: z.string().optional(),
  relationship: z.string({
    required_error: 'Relationship is required',
    invalid_type_error: 'Relationship must be a string',
  }),
  logoId: z.number().optional(),
});

export type CreateParentDto = z.infer<typeof CreateParentSchema>;
