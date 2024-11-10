import { z } from 'zod';

export const UpdateBulkNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  baseNotificationId: z.number(),
});
export type UpdateBulkNotificationDto = z.infer<
  typeof UpdateBulkNotificationSchema
>;
