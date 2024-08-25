import { z } from 'zod';
import { Gender } from 'src/student/entities/student.entity';

const genderList = [...Object.values(Gender)] as [string, ...string[]];

export const UpdateStudentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.coerce.date(),
  permanentAddress: z.string(),
  currentAddress: z.string(),
  ethnic: z.string(),
  birthPlace: z.string(),
  gender: z.enum(genderList),
  information: z.string().optional(),
  studentCvIds: z.array(z.number()).optional(),
  parentIds: z.array(z.number()).optional(),
  logoId: z.number().optional(),
});

export type UpdateStudentDto = z.infer<typeof UpdateStudentSchema>;
