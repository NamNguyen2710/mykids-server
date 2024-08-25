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
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    logo: z
      .object({
        id: z.number(),
        url: z.string(),
      })
      .nullable(),
    children: z.array(
      z.object({ studentId: z.number(), relationship: z.string() }),
    ),
  }),
  assets: z.array(z.object({ id: z.number(), url: z.string() })),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  approveStatus: z.string(),
});

export const ResponseLoaSchema = OriginalLoaSchema.transform((data) => ({
  ...data,
  createdBy: data.createdBy && {
    id: data.createdBy.id,
    firstName: data.createdBy.firstName,
    lastName: data.createdBy.lastName,
    logo: data.createdBy.logo,
    relation:
      data.student &&
      data.createdBy.children.find(
        (child) => child.studentId === data.student.id,
      )?.relationship,
  },
}));

export type ResponseLoaDto = z.infer<typeof ResponseLoaSchema>;
