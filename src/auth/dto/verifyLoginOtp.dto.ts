import { z } from 'zod';

export const VerifyLoginOTPSchema = z.object({
  phoneNumber: z.string(),
  otp: z.string(),
});
export type VerifyLoginOTPDTO = z.infer<typeof VerifyLoginOTPSchema>;
