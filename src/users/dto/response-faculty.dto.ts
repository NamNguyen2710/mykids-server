import { z } from 'zod';

export const OriginalFacultySchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  logo: z
    .object({
      id: z.number(),
      url: z.string(),
    })
    .nullish(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  faculty: z.object({
    assignedSchool: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullish(),
    history: z
      .array(
        z.object({
          classId: z.number(),
          startDate: z.date(),
          endDate: z.date().nullable(),
        }),
      )
      .nullish(),
  }),
  isActive: z.boolean(),
});

export const ResponseFacultySchema = OriginalFacultySchema.transform(
  (data) => ({
    ...data,
    history: data.faculty.history,
    assignedSchool: data.faculty.assignedSchool,
  }),
);
export type ResponseFacultyDto = z.infer<typeof ResponseFacultySchema>;
