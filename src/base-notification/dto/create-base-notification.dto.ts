import { NOTIFICATION_STATUS } from 'src/base-notification/entities/base-notification.entity';
import { z } from 'zod';

export const CreateBaseNotificationSchema = z.object({
  schoolId: z
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be positive')
    .optional(),
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
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty'),
  body: z
    .string({
      required_error: 'Body is required',
      invalid_type_error: 'Body must be a string',
    })
    .min(1, 'Body cannot be empty'),
  data: z.record(z.string()).optional(),
  status: z
    .enum([NOTIFICATION_STATUS.PUBLISHED, NOTIFICATION_STATUS.UNPUBLISHED])
    .default(NOTIFICATION_STATUS.UNPUBLISHED),
  publishedAt: z.coerce
    .date({ invalid_type_error: 'Published At must be a date' })
    .optional(),
});
export type CreateBaseNotificationDto = z.infer<
  typeof CreateBaseNotificationSchema
>;
