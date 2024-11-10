import { z } from 'zod';

export const SaveTokenSchema = z.object({
  deviceType: z.string().optional(),
  notificationToken: z.string(),
});
export type SaveTokenDto = z.infer<typeof SaveTokenSchema>;
