import { z } from 'zod';

export const QueryRoleSchema = z.object({
  schoolId: z.coerce.number().optional(),
});
export type QueryRoleDto = z.infer<typeof QueryRoleSchema>;
