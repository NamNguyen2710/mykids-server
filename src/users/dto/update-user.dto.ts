import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  profession: z.string().optional(),
  isActive: z.boolean().optional(),
  logoId: z.number().optional(),
  otp: z.string().optional(),
  otpExpiresAt: z.date().optional(),
  password: z.string().optional(),
});

export const ConfigedUpdateUserSchema = UpdateUserSchema.transform((data) => {
  if (data.profession) {
    return {
      ...data,
      parent: { profession: data.profession },
    };
  } else {
    delete data.profession;
    return data;
  }
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
