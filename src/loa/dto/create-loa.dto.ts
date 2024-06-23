import { Classrooms } from 'src/class/entities/class.entity';
import { Students } from 'src/student/entities/student.entity';
import { Users } from 'src/users/entity/users.entity';

export class CreateLoaDto {
  student: Students;
  class: Classrooms;
  description: String;
  startDate: Date;
  endDate: Date;
  createdBy: Users;
  // createdById: number;
  // studentId: number;
  // classId: number;
}
