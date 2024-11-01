import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolModule } from 'src/school/school.module';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

import { Students } from 'src/student/entities/student.entity';
import { StudentsParents } from 'src/student/entities/students-parents.entity';
import { StudentParentController } from 'src/student/student-parent.controller';
import { StudentParentService } from 'src/student/student-parent.service';
import { ClassHistoryModule } from 'src/class-history/class-history.module';
import { LoaModule } from 'src/loa/loa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Students, StudentsParents]),
    SchoolModule,
    ClassHistoryModule,
    LoaModule,
  ],
  controllers: [StudentController, StudentParentController],
  providers: [StudentService, StudentParentService],
  exports: [StudentService],
})
export class StudentModule {}
