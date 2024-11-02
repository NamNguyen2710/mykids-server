import { z } from 'zod';

export const QueryScheduleSchema = z.object({
  date: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type QueryScheduleDto = z.infer<typeof QueryScheduleSchema>;
