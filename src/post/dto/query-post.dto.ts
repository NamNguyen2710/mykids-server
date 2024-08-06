import { z } from 'zod';

export const QueryPostSchema = z.object({
  schoolId: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  hashtag: z.string().optional(),
});

export type QueryPostDto = z.infer<typeof QueryPostSchema>;
