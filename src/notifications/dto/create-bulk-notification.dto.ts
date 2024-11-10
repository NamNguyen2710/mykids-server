import { z } from 'zod';

export const CreateBulkNotificationSchema = z.object({
  schoolId: z.number(),
  classId: z.number().optional(),
  roleId: z.number().optional(),
  baseNotificationId: z.number().optional(),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string()).optional(),
});
export type CreateBulkNotificationDto = z.infer<
  typeof CreateBulkNotificationSchema
>;
