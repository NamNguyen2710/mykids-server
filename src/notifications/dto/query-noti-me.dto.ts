import { z } from 'zod';

export const QueryNotiMeSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});
export type QueryNotiMeDTO = z.infer<typeof QueryNotiMeSchema>;
