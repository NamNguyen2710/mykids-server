import { z } from 'zod';

export const QueryNotiSchema = z.object({
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});
export type QueryNotiDTO = z.infer<typeof QueryNotiSchema>;
