import { z } from 'zod';

export const QueryPostSchema = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  classId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  hashtag: z.string().optional(),
});
export type QueryPostDto = z.infer<typeof QueryPostSchema>;

export const ConfigedQueryPostSchema = QueryPostSchema.extend({
  schoolId: z.number().int().positive().optional(),
  classId: z.number().int().positive().nullish(),
  facultyId: z.number().int().positive().optional(),
});
export type ConfigedQueryPostDto = z.infer<typeof ConfigedQueryPostSchema>;
