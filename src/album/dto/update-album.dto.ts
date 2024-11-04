import { z } from 'zod';

export const UpdateAlbumSchema = z.object({
  classId: z.number().nullish(),
  title: z.string().optional(),
  publishedDate: z.coerce.date().optional(),
  assetIds: z.array(z.number()).optional(),
});

export type UpdateAlbumDto = z.infer<typeof UpdateAlbumSchema>;
