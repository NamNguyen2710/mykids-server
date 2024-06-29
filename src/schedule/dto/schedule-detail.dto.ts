import { z } from 'zod';

export const ScheduleDetailSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  resources: z.string().nullish(),
  learningOutcome: z.string().nullish(),
  learningObjective: z.string().nullish(),
  location: z.string().nullish(),
  startTime: z.string(),
  endTime: z.string(),
  classId: z.number(),
});

export type ScheduleDetailDto = z.infer<typeof ScheduleDetailSchema>;
