import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolModule } from 'src/school/school.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

import { Students } from 'src/student/entities/student.entity';
import { StudentsParents } from 'src/student/entities/students-parents.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Students, StudentsParents]),
    SchoolModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
