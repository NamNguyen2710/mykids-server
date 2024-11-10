import { NOTIFICATION_STATUS } from 'src/base-notification/entities/base-notification.entity';
import { z } from 'zod';

export const UpdateBaseNotificationSchema = z.object({
  classId: z.number().optional(),
  roleId: z.number().nullish(),
  title: z.string().optional(),
  body: z.string().optional(),
  status: z
    .enum([
      NOTIFICATION_STATUS.PUBLISHED,
      NOTIFICATION_STATUS.UNPUBLISHED,
      NOTIFICATION_STATUS.RETRACTED,
    ])
    .optional(),
  publishedAt: z.coerce.date().optional(),
});
export type UpdateBaseNotificationDto = z.infer<
  typeof UpdateBaseNotificationSchema
>;
