import { z } from 'zod';

const OriginalAlbumSchema = z.object({
  id: z.number(),
  title: z.string(),
  isPublished: z.boolean(),
  createdDate: z.date(),
  updatedDate: z.date(),
  publishedDate: z.date().nullable(),
  classroom: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  createdBy: z.object({
    user: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      logo: z
        .object({
          id: z.number(),
          url: z.string(),
        })
        .nullable(),
    }),
  }),
  assets: z.array(
    z.object({
      id: z.number(),
      url: z.string(),
    }),
  ),
});
export const ResponseAlbumSchema = OriginalAlbumSchema.transform((data) => ({
  ...data,
  createdBy: {
    ...data.createdBy.user,
    logo: data.createdBy.user.logo ?? null,
  },
  assetsCount: data.assets.length,
}));
export type ResponseAlbumDto = z.infer<typeof ResponseAlbumSchema>;
