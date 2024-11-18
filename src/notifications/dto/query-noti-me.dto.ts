import { z } from 'zod';

export const QueryNotiMeSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  readStatus: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});
export type QueryNotiMeDTO = z.infer<typeof QueryNotiMeSchema>;
