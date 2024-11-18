import { z } from 'zod';
import { Gender } from 'src/student/entities/student.entity';

const genderList = [...Object.values(Gender)] as [string, ...string[]];

export const UpdateStudentSchema = z.object({
  firstName: z
    .string({ invalid_type_error: 'First name must be a string' })
    .optional(),
  lastName: z
    .string({ invalid_type_error: 'Last name must be a string' })
    .optional(),
  dateOfBirth: z.coerce
    .date({ invalid_type_error: 'Date of birth must be a date' })
    .optional(),
  permanentAddress: z
    .string({ invalid_type_error: 'Permanent address must be a string' })
    .optional(),
  currentAddress: z
    .string({ invalid_type_error: 'Current address must be a string' })
    .optional(),
  ethnic: z
    .string({ invalid_type_error: 'Ethnic must be a string' })
    .optional(),
  birthPlace: z
    .string({ invalid_type_error: 'Birth place must be a string' })
    .optional(),
  gender: z
    .enum(genderList, { invalid_type_error: 'Gender must male or female' })
    .optional(),
  information: z.string().optional(),
  studentCvIds: z.array(z.number()).optional(),
  logoId: z.number().optional(),
});

export type UpdateStudentDto = z.infer<typeof UpdateStudentSchema>;
