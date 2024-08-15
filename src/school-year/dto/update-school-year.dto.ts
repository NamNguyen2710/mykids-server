import { z } from 'zod';

export const UpdateSchoolYearSchema = z.object({
  year: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type UpdateSchoolYearDto = z.infer<typeof UpdateSchoolYearSchema>;
