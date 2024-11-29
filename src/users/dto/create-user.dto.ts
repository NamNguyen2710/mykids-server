import { z } from 'zod';
import { Role } from 'src/role/entities/roles.data';

export const CreateUserSchema = z
  .object({
    firstName: z
      .string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string',
      })
      .min(1, 'First name cannot be empty'),
    lastName: z
      .string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
      })
      .min(1, 'Last name cannot be empty'),
    phoneNumber: z.string().optional(),
    email: z
      .string({ invalid_type_error: 'Email must be a string' })
      .email('Invalid email format')
      .optional(),
    password: z
      .string({ invalid_type_error: 'Password must be a string' })
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .optional(),
    roleId: z
      .number({
        required_error: 'Role ID is required',
        invalid_type_error: 'Role ID must be a number',
      })
      .int('Role ID must be an integer')
      .positive('Role ID must be positive'),
    schoolId: z
      .number({ invalid_type_error: 'School ID must be a number' })
      .int('School ID must be an integer')
      .positive('School ID must be positive')
      .optional(),
    profession: z
      .string({ invalid_type_error: 'Profession must be a string' })
      .optional(),
    logoId: z
      .number({ invalid_type_error: 'Logo ID must be a number' })
      .int('Logo ID must be an integer')
      .positive('Logo ID must be positive')
      .nullish(),
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
