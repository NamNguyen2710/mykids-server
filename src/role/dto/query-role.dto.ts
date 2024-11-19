import { z } from 'zod';

export const QueryRoleSchema = z.object({
  schoolId: z.coerce
    .number({ invalid_type_error: 'School ID must be a number' })
    .optional(),
});
export type QueryRoleDto = z.infer<typeof QueryRoleSchema>;
