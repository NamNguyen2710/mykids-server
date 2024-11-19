import { z } from 'zod';

export const QueryUserSchema = z.object({
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be an integer')
    .positive('Limit must be positive')
    .optional(),
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be an integer')
    .positive('Page must be positive')
    .optional(),
  q: z.string({ invalid_type_error: 'Query must be a string' }).optional(),
  phoneNumber: z
    .string({ invalid_type_error: 'Phone number must be a string' })
    .optional(),
  sort: z
    .string({ invalid_type_error: 'Sort type must be a string' })
    .optional(),
  order: z
    .string({ invalid_type_error: 'Sort order must be a string' })
    .optional(),
  roleId: z.coerce
    .number({ invalid_type_error: 'Role ID must be a number' })
    .int('Role ID must be an integer')
    .positive('Role ID must be positive')
    .optional(),
  schoolId: z.coerce
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be positive')
    .optional(),
  classId: z.coerce
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be positive')
    .optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});
export type QueryUserDto = z.infer<typeof QueryUserSchema>;
