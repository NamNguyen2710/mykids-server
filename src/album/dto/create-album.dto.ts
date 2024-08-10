import { z } from 'zod';

export const CreateAlbumSchema = z.object({
  title: z.string(),
  schoolId: z.number(),
  classId: z.number().optional(),
  publishedDate: z.string().optional(),
});

export type CreateAlbumDto = z.infer<typeof CreateAlbumSchema>;
