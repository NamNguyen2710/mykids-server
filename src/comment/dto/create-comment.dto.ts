import { z } from 'zod';

export const CreateCommentSchema = z.object({
  message: z.string(),
  postId: z.number(),
});
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
