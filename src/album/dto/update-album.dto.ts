import { z } from 'zod';

export const UpdateAlbumSchema = z.object({
  title: z.string(),
  publishedDate: z.string().optional(),
  assetIds: z.array(z.number()).optional(),
});

export type UpdateAlbumDto = z.infer<typeof UpdateAlbumSchema>;
