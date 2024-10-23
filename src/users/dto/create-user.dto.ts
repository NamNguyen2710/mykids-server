import { z } from 'zod';
import { Role } from 'src/role/entities/roles.data';

export const CreateUserSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    roleId: z.number(),
    schoolId: z.number().optional(),
    profession: z.string().optional(),
    logoId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.roleId === Role.PARENT) {
      if (!data.phoneNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number is required for Parent',
        });
      }
    } else if (data.roleId === Role.SUPER_ADMIN) {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required for Super Admin',
        });
      }
      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required for Super Admin',
        });
      }
    } else {
      if (!data.schoolId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'School ID is required for School Faculty',
        });
      }
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required for School Faculty',
        });
      }
      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required for School Faculty',
        });
      }
    }

    return data;
  });
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const CreateParentSchema = CreateUserSchema.transform((data) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  roleId: Role.PARENT,
  logoId: data.logoId,
  phoneNumber: data.phoneNumber,
  parent: {
    profession: data.profession,
  },
}));
export const CreateSuperAdminSchema = CreateUserSchema.transform((data) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  roleId: Role.SUPER_ADMIN,
  logoId: data.logoId,
  email: data.email,
  password: data.password,
}));
export const CreateFacultySchema = CreateUserSchema.transform((data) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  roleId: data.roleId,
  logoId: data.logoId,
  email: data.email,
  password: data.password,
  faculty: {
    schoolId: data.schoolId,
  },
}));
