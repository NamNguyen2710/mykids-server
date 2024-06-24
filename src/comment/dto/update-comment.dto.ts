import { z } from 'zod';

export const UpdateCommentSchema = z.object({
  message: z.string(),
});
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;
