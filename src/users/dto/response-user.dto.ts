import { z } from 'zod';

export const ResponseUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});
export type ResponseUserDto = z.infer<typeof ResponseUserSchema>;
