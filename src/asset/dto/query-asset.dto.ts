import { z } from 'zod';

export const QueryAssetSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
export type QueryAssetDto = z.infer<typeof QueryAssetSchema>;
