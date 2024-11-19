import { z } from 'zod';

export const CreateCommentSchema = z.object({
  message: z
    .string({
      invalid_type_error: 'Message must be a string',
      required_error: 'Message is required',
    })
    .min(1, 'Message cannot be empty'),
  postId: z
    .number({
      invalid_type_error: 'Post ID must be a number',
      required_error: 'Post ID is required',
    })
    .int('Post ID must be an integer')
    .positive('Post ID must be a positive number'),
});
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
