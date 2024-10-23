import { z } from 'zod';

export const UpdateParentSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  profession: z.string().optional(),
  relationship: z.string().optional(),
});
export type UpdateParentDto = z.infer<typeof UpdateParentSchema>;
