import { z } from 'zod';

export const SendNotificationSchema = z.object({
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
  tokens: z.array(
    z.string({ invalid_type_error: 'Each token must be a string' }),
    {
      required_error: 'Tokens are required',
      invalid_type_error: 'Tokens must be an array of strings',
    },
  ),
  data: z.record(z.string()).optional(),
});
export type SendNotificationDto = z.infer<typeof SendNotificationSchema>;
