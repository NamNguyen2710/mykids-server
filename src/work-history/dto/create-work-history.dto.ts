import { z } from 'zod';

export const CreateWorkHistorySchema = z.object({
  startDate: z.coerce.date({
    invalid_type_error: 'Start date must be a valid date',
    required_error: 'Start date is required',
  }),
});
export type CreateWorkHistoryDto = z.infer<typeof CreateWorkHistorySchema>;
