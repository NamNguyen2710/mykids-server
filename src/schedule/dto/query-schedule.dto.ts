import { z } from 'zod';

export const QueryScheduleSchema = z.object({
  date: z.coerce
    .date({ invalid_type_error: 'Date must be a valid date' })
    .optional(),
  startDate: z.coerce
    .date({ invalid_type_error: 'Start Date must be a valid date' })
    .optional(),
  endDate: z.coerce
    .date({ invalid_type_error: 'End Date must be a valid date' })
    .optional(),
});

export type QueryScheduleDto = z.infer<typeof QueryScheduleSchema>;
