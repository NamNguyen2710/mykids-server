import { z } from 'zod';

export const VerifySchema = z.object({
  phoneNumber: z.string(),
  otp: z.string(),
});
export type VerifyDTO = z.infer<typeof VerifySchema>;
