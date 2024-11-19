import { z } from 'zod';

export const CreateSchoolYearSchema = z.object({
  year: z
    .string({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a string',
    })
    .min(1, 'Year must be at least 1 character long'),
  startDate: z.coerce.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a date',
  }),
  endDate: z.coerce.date({
    required_error: 'End date is required',
    invalid_type_error: 'End date must be a date',
  }),
  schoolId: z
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer')
    .optional(),
});

export type CreateSchoolYearDto = z.infer<typeof CreateSchoolYearSchema>;
