import { z } from 'zod';

export const CreatePostSchema = z.object({
  message: z
    .string({
      invalid_type_error: 'Message must be a string',
      required_error: 'Message is required',
    })
    .min(1, 'Message cannot be empty'),
  isPublished: z.boolean({
    invalid_type_error: 'Is Published must be a boolean',
    required_error: 'Is Published is required',
  }),
  schoolId: z
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer')
    .optional(),
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .optional(),
  publishedAt: z.coerce
    .date({ invalid_type_error: 'Published Date must be a valid date' })
    .optional(),
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
