import { LOA_STATUS } from 'src/loa/entities/loa.entity';
import { z } from 'zod';

export const QueryLoaSchema = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  classId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  reviewStatus: z
    .enum([
      LOA_STATUS.APPROVE,
      LOA_STATUS.CANCEL,
      LOA_STATUS.PENDING,
      LOA_STATUS.REJECT,
    ])
    .optional(),
});
export const ConfigedQueryLoaSchema = QueryLoaSchema.extend({
  classId: z.coerce.number().int().positive().nullish(),
  schoolId: z.coerce.number().int().positive().optional(),
  facultyId: z.coerce.number().int().positive().optional(),
});

export type QueryLoaDto = z.infer<typeof QueryLoaSchema>;
export type ConfigedQueryLoaDto = z.infer<typeof ConfigedQueryLoaSchema>;
