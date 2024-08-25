import { z } from 'zod';

export const OriginalProfileSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  logo: z
    .object({
      id: z.number(),
      url: z.string(),
    })
    .nullable(),
  children: z.array(
    z.object({
      studentId: z.number(),
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
        school: z.object({
          id: z.number(),
          name: z.string(),
        }),
        history: z.array(
          z.object({
            classroom: z.object({
              id: z.number(),
              name: z.string(),
            }),
          }),
        ),
      }),
    }),
  ),
});

export const ParentProfileSchema = OriginalProfileSchema.transform((data) => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  phoneNumber: data.phoneNumber,
  logo: data.logo,
  children: data.children.map((child) => ({
    id: child.student.id,
    firstName: child.student.firstName,
    lastName: child.student.lastName,
    logo: child.student.logo,
    school: {
      id: child.student.school.id,
      name: child.student.school.name,
    },
    class: {
      id: child.student.history[0].classroom.id,
      name: child.student.history[0].classroom.name,
    },
  })),
}));

export type ParentProfileDto = z.infer<typeof ParentProfileSchema>;
