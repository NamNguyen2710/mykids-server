import { z } from 'zod';

export const CreateAlbumSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty'),
  schoolId: z
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an interger')
    .positive('School ID must be positive')
    .optional(),
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an interger')
    .positive('Class ID must be positive')
    .optional(),
  isPublished: z
    .boolean({ invalid_type_error: 'isPublished must be a boolean' })
    .optional(),
  publishedDate: z.coerce
    .date({ invalid_type_error: 'Published date must be a valid date' })
    .optional(),
});

export type CreateAlbumDto = z.infer<typeof CreateAlbumSchema>;
