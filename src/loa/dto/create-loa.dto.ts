import { z } from 'zod';

export const CreateLoaSchema = z.object({
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .min(1, 'Description cannot be empty'),
  startDate: z.coerce.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date',
  }),
  endDate: z.coerce.date({
    required_error: 'End date is required',
    invalid_type_error: 'End date must be a valid date',
  }),
  studentId: z
    .number({
      required_error: 'Student ID is required',
      invalid_type_error: 'Student ID must be a number',
    })
    .int('Student ID must be an integer')
    .positive('Student ID must be positive'),
  classId: z
    .number({
      required_error: 'Class ID is required',
      invalid_type_error: 'Class ID must be a number',
    })
    .int('Class ID must be an integer')
    .positive('Class ID must be positive'),
  assetIds: z
    .array(
      z
        .number({
          invalid_type_error: 'Each asset ID must be a number',
        })
        .int('Asset ID must be an integer')
        .positive('Asset ID must be positive'),
      {
        invalid_type_error: 'Asset IDs must be an array of numbers',
      },
    )
    .optional(),
});

export type CreateLoaDto = z.infer<typeof CreateLoaSchema>;
