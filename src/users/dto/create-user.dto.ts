import { z } from 'zod';
import * as Role from '../entity/roles.data';

export const CreateUserSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    roleId: z.number(),
    schoolId: z.number().optional(),
    profession: z.string().optional(),
    logoId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.roleId === Role.SchoolAdmin.id) {
      if (!data.schoolId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'School ID is required for School Admin',
        });
      }
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required for School Admin',
        });
      }
      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required for School Admin',
        });
      }
    } else {
      delete data.schoolId;
    }

    return data;
  });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
