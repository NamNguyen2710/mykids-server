import { z } from 'zod';

export const QueryClassesSchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  schoolId: z.coerce.number().int().positive().optional(),
  schoolYearId: z.coerce.number().int().positive().optional(),
  isActive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === undefined || v === 'true'),
});

export type QueryClassesDto = z.infer<typeof QueryClassesSchema>;
