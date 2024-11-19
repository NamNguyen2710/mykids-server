import { z } from 'zod';

export const QueryClassesSchema = z.object({
  q: z.string({ invalid_type_error: 'Query must be a string' }).optional(),
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
  schoolYearId: z.coerce
    .number({ invalid_type_error: 'School Year ID must be a number' })
    .int('School Year ID must be an integer')
    .positive('School Year ID must be positive')
    .optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
});
export type QueryClassesDto = z.infer<typeof QueryClassesSchema>;

export const ConfigedQueryClassesSchema = QueryClassesSchema.extend({
  schoolId: z.coerce
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be positive')
    .optional(),
  facultyId: z.coerce
    .number({ invalid_type_error: 'Faculty ID must be a number' })
    .int('Faculty ID must be an integer')
    .positive('Faculty ID must be positive')
    .optional(),
  studentId: z.coerce
    .number({ invalid_type_error: 'Student ID must be a number' })
    .int('Student ID must be an integer')
    .positive('Student ID must be positive')
    .optional(),
});
export type ConfigedQueryClassesDto = z.infer<
  typeof ConfigedQueryClassesSchema
>;
