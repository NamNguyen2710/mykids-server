import { z } from 'zod';

export const QueryAlbumSchema = z.object({
  schoolId: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export type QueryAlbumDto = z.infer<typeof QueryAlbumSchema>;
