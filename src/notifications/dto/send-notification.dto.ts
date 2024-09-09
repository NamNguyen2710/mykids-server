import { z } from 'zod';

export const SendNotificationSchema = z.object({
  schoolId: z.number(),
  classId: z.number().optional(),
  title: z.string(),
  body: z.string(),
});
export type SendNotificationDTO = z.infer<typeof SendNotificationSchema>;
