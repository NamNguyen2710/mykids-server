import { z } from 'zod';

export const QuerySchoolSchema = z.object({
  name: z.string({ invalid_type_error: 'Name must be a string' }).optional(),
  limit: z
    .number({ invalid_type_error: 'Limit must be a number' })
    .int({ message: 'Limit must be an integer' })
    .positive({ message: 'Limit must be a positive number' })
    .optional(),
  page: z
    .number({ invalid_type_error: 'Page must be a number' })
    .int({ message: 'Page must be an integer' })
    .positive({ message: 'Page must be a positive number' })
    .optional(),
});
export type QuerySchoolDto = z.infer<typeof QuerySchoolSchema>;
