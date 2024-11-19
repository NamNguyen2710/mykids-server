import { z } from 'zod';

export const VerifyLoginOTPSchema = z.object({
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number must be a string',
    })
    .min(1, 'Phone number cannot be empty'),
  otp: z
    .string({
      required_error: 'OTP is required',
      invalid_type_error: 'OTP must be a string',
    })
    .min(1, 'OTP cannot be empty'),
});
export type VerifyLoginOTPDTO = z.infer<typeof VerifyLoginOTPSchema>;
