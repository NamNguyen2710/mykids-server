import { z } from 'zod';

export const QueryPostSchema = z.object({
  studentId: z.coerce
    .number({ invalid_type_error: 'Student ID must be a number' })
    .int('Student ID must be an integer')
    .positive('Student ID must be a positive integer')
    .optional(),
  classId: z.coerce
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .optional(),
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
  hashtag: z
    .string({ invalid_type_error: 'Hashtag must be a string' })
    .optional(),
});
export type QueryPostDto = z.infer<typeof QueryPostSchema>;

export const ConfigedQueryPostSchema = QueryPostSchema.extend({
  schoolId: z
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer')
    .optional(),
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .nullish(),
  facultyId: z
    .number({ invalid_type_error: 'Faculty ID must be a number' })
    .int('Faculty ID must be an integer')
    .positive('Faculty ID must be a positive integer')
    .optional(),
});
export type ConfigedQueryPostDto = z.infer<typeof ConfigedQueryPostSchema>;
