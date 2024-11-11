import { z } from 'zod';

export const SendNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  tokens: z.array(z.string()),
  data: z.record(z.string()).optional(),
});
export type SendNotificationDto = z.infer<typeof SendNotificationSchema>;
