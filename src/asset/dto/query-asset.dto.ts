import { z } from 'zod';

export const QueryAssetSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type QueryAssetDto = z.infer<typeof QueryAssetSchema>;
