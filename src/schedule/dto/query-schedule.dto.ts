import { z } from 'zod';

export const QueryScheduleSchema = z.object({
  classId: z.coerce.number(),
  date: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type QueryScheduleDto = z.infer<typeof QueryScheduleSchema>;
