import { NOTIFICATION_STATUS } from 'src/base-notification/entities/base-notification.entity';
import { z } from 'zod';

export const UpdateBaseNotificationSchema = z.object({
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be positive')
    .optional(),
  roleId: z
    .number({ invalid_type_error: 'Role ID must be a number' })
    .int('Role ID must be an integer')
    .positive('Role ID must be positive')
    .nullish(),
  title: z.string({ invalid_type_error: 'Title must be a string' }).optional(),
  body: z.string({ invalid_type_error: 'Body must be a string' }).optional(),
  status: z
    .enum([
      NOTIFICATION_STATUS.PUBLISHED,
      NOTIFICATION_STATUS.UNPUBLISHED,
      NOTIFICATION_STATUS.RETRACTED,
    ])
    .optional(),
  publishedAt: z.coerce
    .date({ invalid_type_error: 'Published At must be a date' })
    .optional(),
});
export type UpdateBaseNotificationDto = z.infer<
  typeof UpdateBaseNotificationSchema
>;
