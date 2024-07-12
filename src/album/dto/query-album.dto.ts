import { z } from 'zod';

export const QueryAlbumSchema = z.object({
  schoolId: z.number().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export type QueryAlbumDto = z.infer<typeof QueryAlbumSchema>;
