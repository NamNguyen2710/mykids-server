import { z } from 'zod';

export const QueryMedicalSchema = z.object({
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be an integer')
    .positive('Limit must be a positive integer')
    .optional(),
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be an integer')
    .positive('Page must be a positive integer')
    .optional(),
  schoolId: z.coerce
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer')
    .optional(),
  classId: z.coerce
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .optional(),
  studentId: z.coerce
    .number({ invalid_type_error: 'Student ID must be a number' })
    .int('Student ID must be an integer')
    .positive('Student ID must be a positive integer')
    .optional(),
});
export type QueryMedicalDTO = z.infer<typeof QueryMedicalSchema>;
