import { z } from 'zod';

export const QueryAlbumSchema = z.object({
  studentId: z.coerce
    .number({ invalid_type_error: 'Student ID must be a number' })
    .int('Student ID must be an integer')
    .positive('Student ID must be positive')
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
  isPublished: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export type QueryAlbumDto = z.infer<typeof QueryAlbumSchema>;

export const ConfigedQueryAlbumSchema = QueryAlbumSchema.extend({
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .nullish(),
  schoolId: z
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer')
    .optional(),
  facultyId: z
    .number({ invalid_type_error: 'Faculty ID must be a number' })
    .int('Faculty ID must be an integer')
    .positive('Faculty ID must be a positive integer')
    .optional(),
});
export type ConfigedQueryAlbumDto = z.infer<typeof ConfigedQueryAlbumSchema>;
