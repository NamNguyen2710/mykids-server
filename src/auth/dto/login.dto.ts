import { z } from 'zod';

export const LoginSchema = z.object({
  phoneNumber: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
