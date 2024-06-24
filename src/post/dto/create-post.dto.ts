import { z } from 'zod';

export const CreatePostSchema = z.object({
  message: z.string(),
  isPublished: z.boolean(),
  schoolId: z.number(),
  publishedAt: z.date().optional(),
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
