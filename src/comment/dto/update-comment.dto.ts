import { z } from 'zod';

export const UpdateCommentSchema = z.object({
  message: z
    .string({
      invalid_type_error: 'Message must be a string',
      required_error: 'Message is required',
    })
    .min(1, 'Message cannot be empty'),
});
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;
