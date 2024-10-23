import { z } from 'zod';
import { OriginalProfileSchema } from 'src/profile/dto/response-parent-profile.dto';

export const ResponseParentSchema = OriginalProfileSchema.transform((data) => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  phoneNumber: data.phoneNumber,
  email: data.email,
  logo: data.logo,
  profession: data.parent.profession,
  isActive: data.isActive,
}));
export type ResponseParentDto = z.infer<typeof ResponseParentSchema>;
