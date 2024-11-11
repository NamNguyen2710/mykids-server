import { z } from 'zod';

export const CreatePostSchema = z.object({
  message: z.string(),
  isPublished: z.boolean(),
  schoolId: z.number().int().positive().optional(),
  classId: z.number().int().positive().optional(),
  publishedAt: z.coerce.date().optional(),
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
