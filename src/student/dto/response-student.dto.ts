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
  history: z
    .array(
      z.object({
        description: z.string().nullable(),
        classroom: z.object({
          id: z.number(),
          name: z.string(),
          schoolYear: z.object({
            id: z.number(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date(),
          }),
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
    history:
      data.history &&
      data.history.map((h) => ({ ...h.classroom, description: h.description })),
  }),
);

export type ResponseStudentDto = z.infer<typeof ResponseStudentSchema>;
