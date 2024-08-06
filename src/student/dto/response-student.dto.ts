import { z } from 'zod';

export const ResponseStudentSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  permanentAddress: z.string(),
  currentAddress: z.string(),
  ethnic: z.string(),
  birthPlace: z.string(),
  gender: z.string(),
  infoformation: z.string().nullable(),
  isActive: z.boolean(),
});
export type ResponseStudentDto = z.infer<typeof ResponseStudentSchema>;
