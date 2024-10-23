import { z } from 'zod';

export const QueryUserSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  q: z.string().optional(),
  phoneNumber: z.string().optional(),
  sortType: z.string().optional(),
  sortDirection: z.string().optional(),
  roleId: z.coerce.number().int().positive(),
  schoolId: z.coerce.number().int().positive().optional(),
  classId: z.coerce.number().int().positive().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});
export type QueryUserDto = z.infer<typeof QueryUserSchema>;
