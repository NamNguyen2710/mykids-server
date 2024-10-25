import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string(),
  schoolId: z.number(),
});
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
