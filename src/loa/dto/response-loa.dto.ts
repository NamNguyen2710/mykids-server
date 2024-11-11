import { z } from 'zod';

export const OriginalLoaSchema = z.object({
  id: z.number(),
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
  classroom: z.object({
    id: z.number(),
    name: z.string(),
  }),
  createdBy: z.object({
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
    }),
    children: z.array(
      z.object({ studentId: z.number(), relationship: z.string() }),
    ),
  }),
  assets: z.array(z.object({ id: z.number(), url: z.string() })),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  reviewStatus: z.string(),
  reviewer: z
    .object({
      user: z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
      }),
    })
    .nullable(),
});

export const ResponseLoaSchema = OriginalLoaSchema.transform((data) => ({
  ...data,
  createdBy: data.createdBy && {
    id: data.createdBy.user.id,
    firstName: data.createdBy.user.firstName,
    lastName: data.createdBy.user.lastName,
    logo: data.createdBy.user.logo,
    relationship:
      data.student &&
      data.createdBy.children.find(
        (child) => child.studentId === data.student.id,
      )?.relationship,
  },
  reviewer: data.reviewer && {
    id: data.reviewer.user.id,
    firstName: data.reviewer.user.firstName,
    lastName: data.reviewer.user.lastName,
  },
}));

export type ResponseLoaDto = z.infer<typeof ResponseLoaSchema>;
