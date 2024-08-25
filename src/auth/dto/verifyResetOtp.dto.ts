import { z } from 'zod';

export const VerifyResetOTPSchema = z.object({
  email: z.string(),
  otp: z.string(),
  password: z.string(),
});
export type VerifyResetOTPDTO = z.infer<typeof VerifyResetOTPSchema>;
