import { z } from 'zod';

export const UpdateBulkNotificationSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'Title must be a string',
      required_error: 'Title is required',
    })
    .min(1, 'Title cannot be empty'),
  body: z
    .string({
      invalid_type_error: 'Body must be a string',
      required_error: 'Body is required',
    })
    .min(1, 'Body cannot be empty'),
  baseNotificationId: z
    .number({
      invalid_type_error: 'Base Notification ID must be a number',
      required_error: 'Base Notification ID is required',
    })
    .int('Base Notification ID must be an integer')
    .positive('Base Notification ID must be a positive integer'),
});
export type UpdateBulkNotificationDto = z.infer<
  typeof UpdateBulkNotificationSchema
>;
