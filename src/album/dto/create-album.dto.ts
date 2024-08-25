import { z } from 'zod';

export const CreateAlbumSchema = z.object({
  title: z.string(),
  schoolId: z.number(),
  classId: z.number().optional(),
  isPublished: z.boolean().optional(),
  publishedDate: z.coerce.date().optional(),
});

export type CreateAlbumDto = z.infer<typeof CreateAlbumSchema>;
