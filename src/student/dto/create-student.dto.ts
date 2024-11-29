import { z } from 'zod';
import { Gender } from 'src/student/entities/student.entity';

const genderList = [...Object.values(Gender)] as [string, ...string[]];

export const CreateStudentSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(1, 'First name must be at least 1 character long'),
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, 'Last name must be at least 1 character long'),
  dateOfBirth: z.coerce.date({
    required_error: 'Date of birth is required',
    invalid_type_error: 'Date of birth must be a date',
  }),
  permanentAddress: z
    .string({
      required_error: 'Permanent address is required',
      invalid_type_error: 'Permanent address must be a string',
    })
    .min(1, 'Permanent address must be at least 1 character long'),
  currentAddress: z
    .string({
      required_error: 'Current address is required',
      invalid_type_error: 'Current address must be a string',
    })
    .min(1, 'Current address must be at least 1 character long'),
  ethnic: z
    .string({
      required_error: 'Ethnic is required',
      invalid_type_error: 'Ethnic must be a string',
    })
    .min(1, 'Ethnic must be at least 1 character long'),
  birthPlace: z
    .string({
      required_error: 'Birth place is required',
      invalid_type_error: 'Birth place must be a string',
    })
    .min(1, 'Birth place must be at least 1 character long'),
  gender: z.enum(genderList, {
    required_error: 'Gender is required',
    invalid_type_error: 'Gender must be male or female',
  }),
  information: z
    .string({ invalid_type_error: 'Student information must be a string' })
    .optional(),
  logoId: z
    .number({ invalid_type_error: 'Logo ID must be a number' })
    .int('Logo ID must be an integer')
    .positive('Logo ID must be a positive integer')
    .nullish(),
});

export type CreateStudentDto = z.infer<typeof CreateStudentSchema>;
