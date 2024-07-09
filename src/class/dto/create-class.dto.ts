import { z } from 'zod';

export const CreateClassSchema = z.object({
  name: z.string().min(1).max(60),
  location: z.string().max(255).optional(),
  schoolId: z.number(),
  schoolYearId: z.number(),
});
export type CreateClassDto = z.infer<typeof CreateClassSchema>;
