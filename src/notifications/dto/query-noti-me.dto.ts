import { z } from 'zod';

export const QueryNotiMeSchema = z.object({
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be an integer')
    .positive('Limit must be a positive integer')
    .optional(),
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be an integer')
    .positive('Page must be a positive integer')
    .optional(),
  readStatus: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});
export type QueryNotiMeDTO = z.infer<typeof QueryNotiMeSchema>;
