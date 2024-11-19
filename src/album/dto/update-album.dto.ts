import { z } from 'zod';

export const UpdateAlbumSchema = z.object({
  classId: z
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be a positive integer')
    .nullish(),
  title: z.string({ invalid_type_error: 'Title must be a string' }).optional(),
  isPublished: z
    .boolean({ invalid_type_error: 'Is Published must be a boolean' })
    .optional(),
  publishedDate: z.coerce
    .date({ invalid_type_error: 'Published Date must be a valid date' })
    .optional(),
  assetIds: z
    .array(
      z
        .number({ invalid_type_error: 'Each assetId must be a number' })
        .int('Each assetId must be an integer')
        .positive('Each assetId must be a positive integer'),
    )
    .optional(),
});

export type UpdateAlbumDto = z.infer<typeof UpdateAlbumSchema>;
