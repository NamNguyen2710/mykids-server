import { z } from 'zod';

export const TaggedUserDetailSchema = z.object({
  placeholder: z.string(),
  userId: z.number(),
  text: z.string(),
});
export type TaggedUserDetailDto = z.infer<typeof TaggedUserDetailSchema>;
