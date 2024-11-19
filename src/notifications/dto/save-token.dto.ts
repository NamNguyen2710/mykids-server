import { z } from 'zod';

export const SaveTokenSchema = z.object({
  deviceType: z
    .string({ invalid_type_error: 'Device Type must be a string' })
    .optional(),
  notificationToken: z
    .string({
      invalid_type_error: 'Notification Token must be a string',
      required_error: 'Notification Token is required',
    })
    .min(1, 'Notification Token cannot be empty'),
});
export type SaveTokenDto = z.infer<typeof SaveTokenSchema>;
