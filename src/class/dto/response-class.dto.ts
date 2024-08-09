import { z } from 'zod';

export const DefaultClassSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string().nullable(),
  students: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
    }),
  ),
  isActive: z.boolean(),
});

export type DefaultClassDto = z.infer<typeof DefaultClassSchema>;
