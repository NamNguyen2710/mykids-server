import { z } from 'zod';

export const QueryStudentSchema = z.object({
  name: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  schoolId: z.coerce.number().int().positive(),
  classId: z.coerce.number().int().positive().optional(),
  hasNoClass: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  sort: z.enum(['created_at', 'name', 'id', 'date_of_birth']).optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
});

export type QueryStudentDto = z.infer<typeof QueryStudentSchema>;
