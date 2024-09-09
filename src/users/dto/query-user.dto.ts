import { z } from 'zod';

export const QueryUserSchema = z.object({
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  q: z.string().optional(),
  phoneNumber: z.string().optional(),
  sortType: z.string().optional(),
  sortDirection: z.string().optional(),
  roleId: z.coerce.number().optional(),
  schoolId: z.coerce.number().optional(),
  classId: z.coerce.number().optional(),
  isActive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});
export type QueryUserDto = z.infer<typeof QueryUserSchema>;
