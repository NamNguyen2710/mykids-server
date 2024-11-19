import { z } from 'zod';

export const QueryStudentSchema = z.object({
  name: z.string().optional(),
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be a positive integer')
    .positive('Limit must be a positive integer')
    .optional(),
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be a positive integer')
    .positive('Page must be a positive integer')
    .optional(),
  schoolId: z.coerce
    .number({
      required_error: 'School ID is required',
      invalid_type_error: 'School ID must be a number',
    })
    .int('School ID must be a positive integer')
    .positive('School ID must be a positive integer'),
  classId: z.coerce
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be a positive integer')
    .positive('Class ID must be a positive integer')
    .optional(),
  hasNoClass: z
    .enum(['true', 'false'], {
      invalid_type_error: 'Has No Class must be true or false',
    })
    .optional()
    .transform((v) => v === 'true'),
  isActive: z
    .string({ invalid_type_error: 'Is Active must be a string' })
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
