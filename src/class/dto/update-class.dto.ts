import { z } from 'zod';

export const UpdateClassSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  location: z.string().max(255).optional(),
});
export type UpdateClassDto = z.infer<typeof UpdateClassSchema>;
