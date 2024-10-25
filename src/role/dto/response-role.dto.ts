import { z } from 'zod';

export const ResponseRoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  users: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
    }),
  ),
});
export type ResponseRoleDto = z.infer<typeof ResponseRoleSchema>;
