import { z } from 'zod';

const OriginalStudentParentSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable(),
  phoneNumber: z.string(),
  isActive: z.boolean(),
  parent: z.object({
    profession: z.string().nullable(),
  }),
  relationship: z.string(),
});
export const ResponseStudentParentSchema =
  OriginalStudentParentSchema.transform((data) => ({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    isActive: data.isActive,
    profession: data.parent.profession,
    relationship: data.relationship,
  }));

export type ResponseStudentParentDto = z.infer<
  typeof ResponseStudentParentSchema
>;
