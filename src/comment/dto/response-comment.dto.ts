import { z } from 'zod';
import { ResponseUserSchema } from 'src/users/dto/response-user.dto';

export const ResponseCommentSchema = z.object({
  id: z.number(),
  message: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.string(),
  createdBy: ResponseUserSchema,
  taggedUsers: z.array(
    z.object({
      placeholder: z.string(),
      text: z.string(),
      user: ResponseUserSchema,
    }),
  ),
});
export type ResponseCommentDto = z.infer<typeof ResponseCommentSchema>;
