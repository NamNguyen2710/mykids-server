import { z } from 'zod';

export const UpdateSchoolYearSchema = z.object({
  year: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type UpdateSchoolYearDto = z.infer<typeof UpdateSchoolYearSchema>;
