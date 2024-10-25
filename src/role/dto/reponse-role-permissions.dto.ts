import { z } from 'zod';

const RolePermissionsSchema = z.array(
  z.object({
    roleId: z.number(),
    permissionId: z.number(),
    isActive: z.boolean(),
    permission: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
    }),
  }),
);

export const ResponseRolePermissionsSchema = RolePermissionsSchema.transform(
  (data) =>
    data.map((rp) => ({
      permissionId: rp.permissionId,
      name: rp.permission.name,
      description: rp.permission.description,
      isActive: rp.isActive,
    })),
);
export type ResponseRolePermissionsDto = z.infer<
  typeof ResponseRolePermissionsSchema
>;
