import { z } from 'zod';
import { Gender } from 'src/student/entities/student.entity';

const genderList = [...Object.values(Gender)] as [string, ...string[]];

export const CreateStudentSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last name must be a string',
  }),
  dateOfBirth: z.coerce.date({
    required_error: 'Date of birth is required',
    invalid_type_error: 'Date of birth must be a date',
  }),
  permanentAddress: z.string({
    required_error: 'Permanent address is required',
    invalid_type_error: 'Permanent address must be a string',
  }),
  currentAddress: z.string({
    required_error: 'Current address is required',
    invalid_type_error: 'Current address must be a string',
  }),
  ethnic: z.string({
    required_error: 'Ethnic is required',
    invalid_type_error: 'Ethnic must be a string',
  }),
  birthPlace: z.string({
    required_error: 'Birth place is required',
    invalid_type_error: 'Birth place must be a string',
  }),
  gender: z.enum(genderList, {
    required_error: 'Gender is required',
    invalid_type_error: 'Gender must be male or female',
  }),
  information: z.string().optional(),
  logoId: z.number().optional(),
});

export type CreateStudentDto = z.infer<typeof CreateStudentSchema>;
