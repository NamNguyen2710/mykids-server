import { z } from 'zod';

export const CreateMedicalSchema = z.object({
  schoolId: z
    .number({
      invalid_type_error: 'School ID must be a number',
      required_error: 'School ID is required',
    })
    .int('School ID must be an integer')
    .positive('School ID must be a positive integer'),
  assetIds: z.array(
    z
      .number({ invalid_type_error: 'Each assetId must be a number' })
      .int('Each assetId must be an integer')
      .positive('Each assetId must be a positive integer'),
  ),
  history: z
    .string({ invalid_type_error: 'History must be a string' })
    .optional(),
  currentMedication: z
    .string({ invalid_type_error: 'Current Medication must be a string' })
    .optional(),
  allergies: z
    .string({ invalid_type_error: 'Allergies must be a string' })
    .optional(),
  vaccinations: z
    .string({ invalid_type_error: 'Vaccinations must be a string' })
    .optional(),
  instruction: z
    .string({ invalid_type_error: 'Instruction must be a string' })
    .optional(),
});
export type CreateMedicalDto = z.infer<typeof CreateMedicalSchema>;
