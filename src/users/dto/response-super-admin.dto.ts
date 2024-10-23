import { z } from 'zod';

export const ResponseSuperAdminSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  logo: z
    .object({
      id: z.number(),
      url: z.string(),
    })
    .nullish(),
  email: z.string(),
  isActive: z.boolean(),
});

export type ResponseSuperAdminDto = z.infer<typeof ResponseSuperAdminSchema>;
