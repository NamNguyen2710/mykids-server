import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentSchema } from 'src/student/dto/query-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    const studentQuery = QueryStudentSchema.parse(query);
    return this.studentService.findAll(studentQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const studentId = parseInt(id);
    if (Number.isNaN(studentId) || studentId < 1)
      throw new BadRequestException('Invalid student id');

    return this.studentService.update(studentId, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const studentId = parseInt(id);
    if (Number.isNaN(studentId) || studentId < 1)
      throw new BadRequestException('Invalid student id');

    return this.studentService.remove(studentId);
  }
}
