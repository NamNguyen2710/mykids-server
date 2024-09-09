import { z } from 'zod';

export const QueryStudentSchema = z.object({
  name: z.string().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  schoolId: z.coerce.number(),
  classId: z.coerce.number().optional(),
  hasNoClass: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  isActive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === undefined || v === 'true'),
});

export type QueryStudentDto = z.infer<typeof QueryStudentSchema>;
