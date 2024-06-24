import { z } from 'zod';

export const DefaultClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string().nullable(),
  isActive: z.boolean(),
});

export type DefaultClassDto = z.infer<typeof DefaultClassSchema>;
