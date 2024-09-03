import { z } from 'zod';

export const DefaultClassSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string().nullable(),
  schoolYear: z
    .object({
      id: z.number(),
      year: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
  students: z
    .array(
      z.object({
        classId: z.number(),
        studentId: z.number(),
        description: z.string().nullable(),
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
          parents: z
            .array(
              z.object({
                parentId: z.number(),
                studentId: z.number(),
                relationship: z.string(),
                parent: z.object({
                  id: z.number(),
                  phoneNumber: z.string(),
                  firstName: z.string(),
                  lastName: z.string(),
                  logo: z
                    .object({
                      id: z.number(),
                      url: z.string(),
                    })
                    .nullable(),
                }),
              }),
            )
            .optional(),
        }),
      }),
    )
    .optional(),
  isActive: z.boolean(),
});

export const ResponseClassSchema = DefaultClassSchema.transform((data) => ({
  ...data,
  schoolYear: { ...data.schoolYear },
  students: data.students.map((student) => ({
    id: student.student.id,
    firstName: student.student.firstName,
    lastName: student.student.lastName,
    logo: { ...student.student.logo },
    description: student.description,
    parents: student.student.parents.map((parent) => ({
      id: parent.parent.id,
      relationship: parent.relationship,
      phoneNumber: parent.parent.phoneNumber,
      firstName: parent.parent.firstName,
      lastName: parent.parent.lastName,
      logo: { ...parent.parent.logo },
    })),
  })),
}));

export type ResponseClassDto = z.infer<typeof ResponseClassSchema>;
