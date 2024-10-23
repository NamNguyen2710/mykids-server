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
  }),
  isActive: z.boolean(),
});

export const ResponseFacultySchema = OriginalFacultySchema.transform(
  (data) => ({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    logo: data.logo,
    isActive: data.isActive,
  }),
);
export type ResponseFacultyDto = z.infer<typeof ResponseFacultySchema>;
