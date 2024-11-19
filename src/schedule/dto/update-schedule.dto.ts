import { z } from 'zod';

export const UpdateScheduleSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(1, 'Name cannot be empty'),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .nullish(),
  resources: z
    .string({ invalid_type_error: 'Resources must be a string' })
    .nullish(),
  learningOutcome: z
    .string({ invalid_type_error: 'Learning Outcome must be a string' })
    .nullish(),
  learningObjective: z
    .string({ invalid_type_error: 'Learning Objective must be a string' })
    .nullish(),
  location: z
    .string({ invalid_type_error: 'Location must be a string' })
    .nullish(),
  startTime: z.coerce
    .date({ invalid_type_error: 'Start Time must be a valid date' })
    .optional(),
  endTime: z.coerce
    .date({ invalid_type_error: 'End Time must be a valid date' })
    .optional(),
});

export type UpdateScheduleDto = z.infer<typeof UpdateScheduleSchema>;
