import { z } from 'zod';
import * as Role from '../entity/roles.data';

export const CreateUserSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    phoneNumber: z.string(),
    roleId: z.number(),
    schoolId: z.number().optional(),
    profession: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.roleId === Role.SchoolAdmin.id && !data.schoolId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'School ID is required for School Admin',
      });
    } else {
      delete data.schoolId;
    }

    return data;
  });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
