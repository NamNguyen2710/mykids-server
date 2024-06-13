import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Students } from 'src/student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Students])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
