import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profession: z.string().optional(),
  assignedSchoolId: z.number().nullable().optional(),
  isActive: z.boolean().optional(),
  logoId: z.number().optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
