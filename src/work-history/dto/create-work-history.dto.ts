import { z } from 'zod';

export const CreateWorkHistorySchema = z.object({
  startDate: z.coerce.date(),
});
export type CreateWorkHistoryDto = z.infer<typeof CreateWorkHistorySchema>;
