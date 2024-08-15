import { z } from 'zod';

export const CreateSchoolYearSchema = z.object({
  year: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  schoolId: z.number(),
});

export type CreateSchoolYearDto = z.infer<typeof CreateSchoolYearSchema>;
