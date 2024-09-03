import { z } from 'zod';

export const CreateParentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  roleId: z.literal(3),
  profession: z.string().optional(),
  relation: z.string(),
  logoId: z.number().optional(),
});

export type CreateParentDto = z.infer<typeof CreateParentSchema>;
