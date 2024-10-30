import { z } from 'zod';

export const UpdateClassHistorySchema = z.object({
  description: z.string().max(255).optional(),
});
export type UpdateClassHistoryDto = z.infer<typeof UpdateClassHistorySchema>;
