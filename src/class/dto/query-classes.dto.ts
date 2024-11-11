import { z } from 'zod';

export const QueryClassesSchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  schoolYearId: z.coerce.number().int().positive().optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
});
export type QueryClassesDto = z.infer<typeof QueryClassesSchema>;

export const ConfigedQueryClassesSchema = QueryClassesSchema.extend({
  schoolId: z.coerce.number().int().positive().optional(),
  facultyId: z.coerce.number().int().positive().optional(),
  studentId: z.coerce.number().int().positive().optional(),
});
export type ConfigedQueryClassesDto = z.infer<
  typeof ConfigedQueryClassesSchema
>;
