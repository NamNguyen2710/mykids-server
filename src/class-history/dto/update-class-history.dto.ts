import { z } from 'zod';

export const UpdateClassHistorySchema = z.object({
  description: z
    .string()
    .max(255, { message: 'Description must be 255 or fewer characters long' })
    .optional(),
});
export type UpdateClassHistoryDto = z.infer<typeof UpdateClassHistorySchema>;
