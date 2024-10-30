import { z } from 'zod';

export const CreateClassHistoriesSchema = z.object({
  studentIds: z.array(z.number()),
  startDate: z.coerce.date(),
});
export type CreateClassHistoriesDto = z.infer<
  typeof CreateClassHistoriesSchema
>;
