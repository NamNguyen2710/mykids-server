import { z } from 'zod';

export const QueryNotiSchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
});
export type QueryNotiDTO = z.infer<typeof QueryNotiSchema>;
