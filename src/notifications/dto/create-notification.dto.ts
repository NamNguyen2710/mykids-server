import { z } from 'zod';

export const CreateNotificationSchema = z.object({
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
  userId: z
    .number({
      invalid_type_error: 'User ID must be a number',
      required_error: 'User ID is required',
    })
    .int('User ID must be an integer')
    .positive('User ID must be a positive integer'),
  data: z.record(z.string()).optional(),
});
export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;
