import { z } from 'zod';
import { LOA_STATUS } from 'src/loa/entities/loa.entity';

const statusList = [...Object.values(LOA_STATUS)] as [string, ...string[]];

export const UpdateLoaSchema = z.object({
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .optional(),
  startDate: z.coerce
    .date({ invalid_type_error: 'Start date must be a valid date' })
    .optional(),
  endDate: z.coerce
    .date({ invalid_type_error: 'End date must be a valid date' })
    .optional(),
  assetIds: z
    .array(
      z
        .number({ invalid_type_error: 'Each asset ID must be a number' })
        .int('Asset ID must be an integer')
        .positive('Asset ID must be positive'),
    )
    .optional(),
});
export type UpdateLoaDto = z.infer<typeof UpdateLoaSchema>;

export const ConfigedUpdateLoaSchema = UpdateLoaSchema.extend({
  reviewer: z
    .object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      gender: z.string(),
    })
    .optional(),
  reviewStatus: z
    .enum(statusList, {
      invalid_type_error: 'Review status must be a valid status',
    })
    .optional(),
});
export type ConfigedUpdateLoaDto = z.infer<typeof ConfigedUpdateLoaSchema>;
