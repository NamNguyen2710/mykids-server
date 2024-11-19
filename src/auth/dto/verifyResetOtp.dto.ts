import { z } from 'zod';

export const VerifyResetOTPSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, 'Email cannot be empty'),
  otp: z
    .string({
      required_error: 'OTP is required',
      invalid_type_error: 'OTP must be a string',
    })
    .min(1, 'OTP cannot be empty'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(1, 'Password cannot be empty'),
});
export type VerifyResetOTPDTO = z.infer<typeof VerifyResetOTPSchema>;
