import { z } from 'zod';

export const CreateClassHistoriesSchema = z.object({
  studentIds: z.array(
    z
      .number({
        invalid_type_error: 'Student ID must be a number',
        required_error: 'Student ID is required',
      })
      .int('Student ID must be an integer')
      .positive('Student ID must be a positive number'),
  ),
  startDate: z.coerce.date({
    invalid_type_error: 'Start date must be a valid date',
    required_error: 'Start date is required',
  }),
});
export type CreateClassHistoriesDto = z.infer<
  typeof CreateClassHistoriesSchema
>;
