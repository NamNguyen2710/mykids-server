import { Classrooms } from 'src/class/entities/class.entity';
import { Students } from 'src/student/entities/student.entity';

export class CreateLoaDto {
  studentId: Students;
  description: String;
  classId: Classrooms;
  startDate: Date;
  endDate: Date;
}
