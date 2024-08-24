import { z } from 'zod';

export const LoginSchema = z
  .object({
    grantType: z.string(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.grantType === 'password') {
      if (!data.password)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required',
        });
      if (!data.email)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
        });
    } else if (data.grantType === 'otp') {
      if (!data.phoneNumber)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number is required',
        });
    }
  });

export type LoginDto = z.infer<typeof LoginSchema>;
