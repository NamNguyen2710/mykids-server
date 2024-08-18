import { z } from 'zod';

export const ResponseMedicalSchema = z.object({
  id: z.number(),
  student: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  assets: z.array(
    z.object({
      id: z.number(),
      url: z.string(),
    }),
  ),
});

export type ResponseMedicalDto = z.infer<typeof ResponseMedicalSchema>;
