import { z } from 'zod';

export const ResponsePostSchema = z.object({
  id: z.number().int().positive(),
  schoolId: z.number().int().positive(),
  message: z.string(),
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date().optional(),
  commentCount: z.number().int().positive(),
  likeCount: z.number().int().positive(),
  likedByUser: z.boolean(),
  createdBy: z.object({
    id: z.number().int().positive(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    isActive: z.boolean(),
    logo: z
      .object({
        id: z.number().int().positive(),
        url: z.string(),
      })
      .nullable(),
  }),
});
