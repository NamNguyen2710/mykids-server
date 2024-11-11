import { z } from 'zod';

export const UpdatePostSchema = z.object({
  message: z.string(),
  isPublished: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
});
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
