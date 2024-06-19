import { z } from 'zod';

export const QueryPostSchema = z.object({
  schoolId: z.number().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
  hashtag: z.string().optional(),
});

export type QueryPostDto = z.infer<typeof QueryPostSchema>;
