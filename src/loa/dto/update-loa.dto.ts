import { z } from 'zod';
import { LOA_STATUS } from 'src/loa/entities/loa.entity';

const statusList = [...Object.values(LOA_STATUS)] as [string, ...string[]];

export const UpdateLoaSchema = z.object({
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  assetIds: z.array(z.number()).optional(),
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
  reviewStatus: z.enum(statusList).optional(),
});
export type ConfigedUpdateLoaDto = z.infer<typeof ConfigedUpdateLoaSchema>;
