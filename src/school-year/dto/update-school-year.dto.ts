import { z } from 'zod';

export const UpdateSchoolYearSchema = z.object({
  year: z.string({ invalid_type_error: 'Year must be a string' }).optional(),
  startDate: z.coerce
    .date({ invalid_type_error: 'Start date must be a date' })
    .optional(),
  endDate: z.coerce
    .date({ invalid_type_error: 'End date must be a date' })
    .optional(),
});

export type UpdateSchoolYearDto = z.infer<typeof UpdateSchoolYearSchema>;
