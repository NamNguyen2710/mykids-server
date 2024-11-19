import { z } from 'zod';

export const UpdatePermissionsSchema = z.array(
  z.object({
    permissionId: z
      .number({
        invalid_type_error: 'Permission ID must be a number',
        required_error: 'Permission ID is required',
      })
      .int('Permission ID must be an integer')
      .positive('Permission ID must be a positive integer'),
    isActive: z.boolean({
      invalid_type_error: 'Is Active must be a boolean',
      required_error: 'Is Active is required',
    }),
  }),
);
export type UpdatePermissionsDto = z.infer<typeof UpdatePermissionsSchema>;
