import { z } from 'zod';

export const ResponseCommentSchema = z.object({
  id: z.number(),
  message: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  taggedUsers: z
    .array(
      z.object({
        placeholder: z.string(),
        text: z.string(),
        user: z.object({
          id: z.number(),
          firstName: z.string(),
          lastName: z.string(),
        }),
      }),
    )
    .optional(),
});
export type ResponseCommentDto = z.infer<typeof ResponseCommentSchema>;
