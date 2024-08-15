import { z } from 'zod';

export const QueryMedicalSchema = z.object({
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  schoolId: z.coerce.number().optional(),
  classId: z.coerce.number().optional(),
  studentId: z.coerce.number().optional(),
});
export type QueryMedicalDTO = z.infer<typeof QueryMedicalSchema>;
