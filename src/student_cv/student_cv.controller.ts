import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { StudentCvService } from './student_cv.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('student-cv')
export class StudentCvController {
  constructor(private readonly studentCvService: StudentCvService) {}

  @Post(':studentId')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadedFile(
    @Param('studentId') studentId: number,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    console.log(studentId);
    return await this.studentCvService.uploadFileToS3(studentId, file);
  }
}
