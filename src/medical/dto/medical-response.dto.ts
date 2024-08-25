import { z } from 'zod';

export const ResponseMedicalSchema = z.object({
  id: z.number(),
  history: z.string(),
  currentMedication: z.string(),
  allergies: z.string(),
  vacinations: z.string(),
  instruction: z.string(),
  student: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    logo: z
      .object({
        id: z.number(),
        url: z.string(),
      })
      .nullable(),
  }),
  assets: z.array(
    z.object({
      id: z.number(),
      url: z.string(),
    }),
  ),
});

export type ResponseMedicalDto = z.infer<typeof ResponseMedicalSchema>;
