import { z } from 'zod';
import { Gender } from 'src/student/entities/student.entity';

const genderList = [...Object.values(Gender)] as [string, ...string[]];

export const UpdateStudentSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  ethnic: z.string().optional(),
  birthPlace: z.string().optional(),
  gender: z.enum(genderList).optional(),
  information: z.string().optional(),
  studentCvIds: z.array(z.number()).optional(),
  logoId: z.number().optional(),
});

export type UpdateStudentDto = z.infer<typeof UpdateStudentSchema>;
