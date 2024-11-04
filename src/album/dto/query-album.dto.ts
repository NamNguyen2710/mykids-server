import { z } from 'zod';

export const QueryAlbumSchema = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  classId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  isPublished: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export type QueryAlbumDto = z.infer<typeof QueryAlbumSchema>;

export const ConfigedQueryAlbumSchema = QueryAlbumSchema.extend({
  classId: z.number().int().positive().nullish(),
  schoolId: z.number().int().positive(),
  facultyId: z.number().int().positive(),
});
export type ConfigedQueryAlbumDto = z.infer<typeof ConfigedQueryAlbumSchema>;
