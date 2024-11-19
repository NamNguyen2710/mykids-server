import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  profession: z.string().optional(),
  logoId: z
    .number()
    .int('Logo ID must be an integer')
    .positive('Logo ID must be positive')
    .optional(),
});

export const ConfigedUpdateUserSchema = UpdateUserSchema.extend({
  isActive: z.boolean().optional(),
  otp: z.string().optional(),
  otpExpiresAt: z.date().optional(),
  password: z.string().optional(),
}).transform((data) => {
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
export type ConfigedUpdateUserDto = z.infer<typeof ConfigedUpdateUserSchema>;
