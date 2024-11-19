import { z } from 'zod';

export const LoginSchema = z
  .object({
    grantType: z
      .string({
        required_error: 'Grant type is required',
        invalid_type_error: 'Grant type must be a string',
      })
      .min(1, 'Grant type cannot be empty'),
    phoneNumber: z
      .string({ invalid_type_error: 'Phone number must be a string' })
      .optional(),
    email: z
      .string({ invalid_type_error: 'Email must be a string' })
      .email('Invalid email format')
      .optional(),
    password: z
      .string({ invalid_type_error: 'Password must be a string' })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.grantType === 'password') {
      if (!data.password || data.password.length < 1)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required',
        });
      if (!data.email || data.email.length < 1)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
        });
    } else if (data.grantType === 'otp') {
      if (!data.phoneNumber || data.phoneNumber.length < 1)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number is required',
        });
    }
  });

export type LoginDto = z.infer<typeof LoginSchema>;
