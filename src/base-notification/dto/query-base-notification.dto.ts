import { z } from 'zod';

export const QueryBaseNotiSchema = z.object({
  classId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});
export type QueryBaseNotiDto = z.infer<typeof QueryBaseNotiSchema>;

export const ConfigedQueryBaseNotiSchema = QueryBaseNotiSchema.extend({
  schoolId: z.coerce.number().int().positive().optional(),
});
export type ConfigedQueryBaseNotiDto = z.infer<
  typeof ConfigedQueryBaseNotiSchema
>;
