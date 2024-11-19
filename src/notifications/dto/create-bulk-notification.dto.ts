import { z } from 'zod';

export const CreateBulkNotificationSchema = z.object({
  schoolId: z
    .number({
      invalid_type_error: 'School ID must be a number',
      required_error: 'School ID is required',
    })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer'),
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .optional(),
  roleId: z
    .number({ invalid_type_error: 'Role ID must be a number' })
    .int('Role ID must be an integer')
    .positive('Role ID must be a positive integer')
    .optional(),
  baseNotificationId: z
    .number({ invalid_type_error: 'Base Notification ID must be a number' })
    .int('Base Notification ID must be an integer')
    .positive('Base Notification ID must be a positive integer')
    .optional(),
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
  data: z.record(z.string()).optional(),
});
export type CreateBulkNotificationDto = z.infer<
  typeof CreateBulkNotificationSchema
>;
