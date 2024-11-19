import { z } from 'zod';

export const QueryBaseNotiSchema = z.object({
  classId: z.coerce
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be positive')
    .optional(),
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be an integer')
    .positive('Limit must be positive')
    .optional(),
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be an integer')
    .positive('Page must be positive')
    .optional(),
});
export type QueryBaseNotiDto = z.infer<typeof QueryBaseNotiSchema>;

export const ConfigedQueryBaseNotiSchema = QueryBaseNotiSchema.extend({
  schoolId: z.coerce
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be positive')
    .optional(),
});
export type ConfigedQueryBaseNotiDto = z.infer<
  typeof ConfigedQueryBaseNotiSchema
>;
