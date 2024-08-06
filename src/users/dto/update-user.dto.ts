import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profession: z.string().nullable().optional(),
  assignedSchoolId: z.number().nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
