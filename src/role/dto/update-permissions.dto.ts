import { z } from 'zod';

export const UpdatePermissionsSchema = z.array(
  z.object({
    permissionId: z.number(),
    isActive: z.boolean(),
  }),
);
export type UpdatePermissionsDto = z.infer<typeof UpdatePermissionsSchema>;
