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
  parents: z
    .array(
      z.object({
        relationship: z.string(),
        parent: z.object({
          id: z.number(),
          firstName: z.string(),
          lastName: z.string(),
          phoneNumber: z.string(),
          profession: z.string().nullable(),
        }),
      }),
    )
    .optional(),
});

export const ResponseStdWithParentSchema = ResponseStudentSchema.transform(
  (data) => ({
    ...data,
    parents: data.parents.map((parent) => ({
      relationship: parent.relationship,
      ...parent.parent,
    })),
  }),
);

export type ResponseStudentDto = z.infer<typeof ResponseStudentSchema>;
