import { z } from 'zod';

export const NotiResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  readStatus: z.boolean(),
});
export type NotiResponseDto = z.infer<typeof NotiResponseSchema>;
