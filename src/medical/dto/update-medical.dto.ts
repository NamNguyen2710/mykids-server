import { z } from 'zod';

export const UpdateMedicalSchema = z.object({
  assetIds: z
    .array(
      z
        .number({ invalid_type_error: 'Each Asset Id must be a number' })
        .int('Each Asset Id must be an integer')
        .positive('Each Asset Id must be a positive integer'),
    )
    .optional(),
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
export type UpdateMedicalDto = z.infer<typeof UpdateMedicalSchema>;
