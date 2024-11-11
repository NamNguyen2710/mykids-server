import { NOTIFICATION_STATUS } from 'src/base-notification/entities/base-notification.entity';
import { z } from 'zod';

export const CreateBaseNotificationSchema = z.object({
  schoolId: z.number().optional(),
  classId: z.number().optional(),
  roleId: z.number().nullish(),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string()).optional(),
  status: z
    .enum([NOTIFICATION_STATUS.PUBLISHED, NOTIFICATION_STATUS.UNPUBLISHED])
    .default(NOTIFICATION_STATUS.UNPUBLISHED),
  publishedAt: z.coerce.date().optional(),
});
export type CreateBaseNotificationDto = z.infer<
  typeof CreateBaseNotificationSchema
>;
