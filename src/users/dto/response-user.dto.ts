import { z } from 'zod';

export const ResponseUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  profession: z.string().nullish(),
  logo: z
    .object({
      id: z.number(),
      url: z.string(),
    })
    .nullish(),
  assignedSchool: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullish(),
});
export type ResponseUserDto = z.infer<typeof ResponseUserSchema>;
