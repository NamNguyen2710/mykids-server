import { LOA_STATUS } from 'src/loa/entities/loa.entity';
import { z } from 'zod';

export const QueryLoaSchema = z.object({
  studentId: z.coerce
    .number({ invalid_type_error: 'Student ID must be a number' })
    .int('Student ID must be an integer')
    .positive('Student ID must be positive')
    .optional(),
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
  reviewStatus: z
    .enum(
      [
        LOA_STATUS.APPROVE,
        LOA_STATUS.CANCEL,
        LOA_STATUS.PENDING,
        LOA_STATUS.REJECT,
      ],
      {
        invalid_type_error: 'Review status must be a valid status',
      },
    )
    .optional(),
});
export const ConfigedQueryLoaSchema = QueryLoaSchema.extend({
  classId: z.coerce
    .number({ invalid_type_error: 'Class ID must be a number' })
    .int('Class ID must be an integer')
    .positive('Class ID must be positive')
    .nullish(),
  schoolId: z.coerce
    .number({ invalid_type_error: 'School ID must be a number' })
    .int('School ID must be an integer')
    .positive('School ID must be positive')
    .optional(),
  facultyId: z.coerce
    .number({ invalid_type_error: 'Faculty ID must be a number' })
    .int('Faculty ID must be an integer')
    .positive('Faculty ID must be positive')
    .optional(),
});

export type QueryLoaDto = z.infer<typeof QueryLoaSchema>;
export type ConfigedQueryLoaDto = z.infer<typeof ConfigedQueryLoaSchema>;
