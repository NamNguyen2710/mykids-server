import { z } from 'zod';

export const CreateSchoolYearSchema = z.object({
  year: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  schoolId: z.number(),
});

export type CreateSchoolYearDto = z.infer<typeof CreateSchoolYearSchema>;
