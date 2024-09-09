import { z } from 'zod';

export const AddStudentsSchema = z.object({
  studentIds: z.array(z.number()),
});
export type AddStudentsDto = z.infer<typeof AddStudentsSchema>;
