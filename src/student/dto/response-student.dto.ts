import { z } from 'zod';

export const ResponseStudentSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  logo: z
    .object({
      id: z.number(),
      url: z.string(),
    })
    .nullable(),
  dateOfBirth: z.coerce.date(),
  permanentAddress: z.string(),
  currentAddress: z.string(),
  ethnic: z.string(),
  birthPlace: z.string(),
  gender: z.string(),
  infoformation: z.string().nullish(),
  isActive: z.boolean(),
  parents: z
    .array(
      z.object({
        relationship: z.string(),
        parent: z.object({
          user: z.object({
            id: z.number(),
            firstName: z.string(),
            lastName: z.string(),
            logo: z
              .object({
                id: z.number(),
                url: z.string(),
              })
              .nullable(),
            phoneNumber: z.string(),
            email: z.string().nullable(),
          }),
          profession: z.string().nullable(),
        }),
      }),
    )
    .nullish(),
});

export const ResponseStdWithParentSchema = ResponseStudentSchema.transform(
  (data) => ({
    ...data,
    parents:
      data.parents &&
      data.parents.map((parent) => ({
        relationship: parent.relationship,
        profession: parent.parent.profession,
        ...parent.parent.user,
      })),
  }),
);

export type ResponseStudentDto = z.infer<typeof ResponseStudentSchema>;
