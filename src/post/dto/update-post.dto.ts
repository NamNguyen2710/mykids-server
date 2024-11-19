import { z } from 'zod';

export const UpdatePostSchema = z.object({
  message: z.string({
    invalid_type_error: 'Message must be a string',
    required_error: 'Message is required',
  }),
  isPublished: z
    .boolean({ invalid_type_error: 'Is Published must be a boolean' })
    .optional(),
  publishedAt: z.coerce
    .date({ invalid_type_error: 'Published Date must be a valid date' })
    .optional(),
});
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
