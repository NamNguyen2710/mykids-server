import { z } from 'zod';

export const CreateNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  data: z.record(z.string()).optional(),
});
export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;
