import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from '@nestjs/class-validator';
import { Students } from 'src/student/entities/student.entity';

export class CreateStudentCvDto {
  @IsString()
  @IsOptional()
  readonly mimeType?: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsNumber()
  @IsNotEmpty()
  readonly student: Students;
}
