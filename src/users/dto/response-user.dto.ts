import { z } from 'zod';

export const ResponseUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  profession: z.string().nullable(),
  assignedSchool: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
});
export type ResponseUserDto = z.infer<typeof ResponseUserSchema>;
