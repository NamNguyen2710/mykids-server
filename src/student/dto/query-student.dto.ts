import { z } from 'zod';

export const QueryStudentSchema = z.object({
  name: z.string().optional(),
  limit: z.coerce
    .number()
    .int('Limit must be a positive integer')
    .positive('Limit must be a positive integer')
    .optional(),
  page: z.coerce
    .number()
    .int('Page must be a positive integer')
    .positive('Page must be a positive integer')
    .optional(),
  schoolId: z.coerce
    .number({ required_error: 'School ID is required' })
    .int('School ID must be a positive integer')
    .positive('School ID must be a positive integer'),
  classId: z.coerce
    .number()
    .int('Class ID must be a positive integer')
    .positive('Class ID must be a positive integer')
    .optional(),
  hasNoClass: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  sort: z
    .enum(['created_at', 'name', 'id', 'date_of_birth'], {
      invalid_type_error: 'Invalid sort type',
    })
    .optional(),
  order: z
    .enum(['ASC', 'DESC'], { invalid_type_error: 'Order must be ASC or DESC' })
    .optional(),
});

export type QueryStudentDto = z.infer<typeof QueryStudentSchema>;
