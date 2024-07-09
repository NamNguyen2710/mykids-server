import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';

import { StudentService } from './student.service';
import { UserService } from 'src/users/users.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  CreateStudentDto,
  CreateStudentSchema,
} from './dto/create-student.dto';
import {
  UpdateStudentDto,
  UpdateStudentSchema,
} from './dto/update-student.dto';
import {
  QueryStudentDto,
  QueryStudentSchema,
} from 'src/student/dto/query-student.dto';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateStudentSchema))
    createStudentDto: CreateStudentDto,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      createStudentDto.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to create a student in this school',
      );

    return this.studentService.create(createStudentDto);
  }

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryStudentSchema))
    query: QueryStudentDto,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      query.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view students in this school',
      );

    return this.studentService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO: Add permission check
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(UpdateStudentSchema))
    updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.studentService.findOne(studentId);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      student.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view students in this school',
      );

    return this.studentService.update(studentId, updateStudentDto);
  }

  @Delete(':id')
  async remove(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    const student = await this.studentService.findOne(studentId);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      student.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view students in this school',
      );

    return this.studentService.deactivate(studentId);
  }
}
