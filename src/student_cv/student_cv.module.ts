import { Module } from '@nestjs/common';
import { StudentCvService } from './student_cv.service';
import { StudentCvController } from './student_cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCV } from './entities/student_cv.entity';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [StudentModule, TypeOrmModule.forFeature([StudentCV])],
  controllers: [StudentCvController],
  providers: [StudentCvService],
  exports: [StudentCvService],
})
export class StudentCvModule {}
