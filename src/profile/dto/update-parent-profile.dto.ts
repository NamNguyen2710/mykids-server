import { z } from 'zod';

export const UpdateParentProfileSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phoneNumber: z.string().min(9).max(15),
  profession: z.string().min(5).max(200),
});
export type UpdateParentProfileDto = z.infer<typeof UpdateParentProfileSchema>;
