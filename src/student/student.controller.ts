import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request,
  ForbiddenException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { StudentService } from './student.service';
import { ValidationService } from 'src/users/validation.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

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
import {
  ResponseStdWithParentSchema,
  ResponseStudentSchema,
} from 'src/student/dto/response-student.dto';
import { CreateParentDto, CreateParentSchema } from './dto/create-parent.dto';
import { ResponseUserSchema } from 'src/users/dto/response-user.dto';
import * as Role from 'src/users/entity/roles.data';

@Controller('student')
@UseGuards(LoginGuard)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateStudentSchema))
    createStudentDto: CreateStudentDto,
  ) {
    const permission =
      await this.validationService.validateSchoolAdminPermission(
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
    const permission =
      await this.validationService.validateSchoolAdminPermission(
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
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const permission =
      (await this.studentService.validateStudentTeacherPermission(
        request.user.sub,
        id,
      )) ||
      (await this.validationService.validateParentChildrenPermission(
        request.user.sub,
        id,
      ));
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view this student',
      );

    const student = await this.studentService.findOne(id, [
      'parents.parent',
      'history.classroom.schoolYear',
      'medical',
    ]);
    return ResponseStdWithParentSchema.parse(student);
  }

  @Put(':id')
  async update(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(UpdateStudentSchema))
    updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.studentService.findOne(studentId);

    if (request.user.role === Role.SchoolAdmin.name) {
      const permission =
        await this.validationService.validateSchoolAdminPermission(
          request.user.sub,
          student.schoolId,
        );
      if (!permission)
        throw new ForbiddenException(
          'You do not have permission to update students in this school',
        );

      delete updateStudentDto.studentCvIds;
    } else if (request.user.role === Role.Parent.name) {
      const permission =
        await this.validationService.validateParentChildrenPermission(
          request.user.sub,
          studentId,
        );
      if (!permission)
        throw new ForbiddenException(
          'You do not have permission to update this student',
        );

      delete updateStudentDto.parentIds;
    } else {
      throw new ForbiddenException(
        'You do not have permission to update student information',
      );
    }

    const updatedStudent = await this.studentService.update(
      studentId,
      updateStudentDto,
    );
    return ResponseStudentSchema.parse(updatedStudent);
  }

  @Post(':id/parent')
  async addStudentParent(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(CreateParentSchema))
    createParentDto: CreateParentDto,
  ) {
    const permission =
      await this.studentService.validateStudentTeacherPermission(
        request.user.sub,
        studentId,
      );

    if (!permission) {
      throw new ForbiddenException(
        'You do not have permission to create parent users',
      );
    }

    const newParent = await this.studentService.addStudentParent(
      createParentDto,
      studentId,
    );
    return ResponseUserSchema.parse(newParent); // Assuming you have a response schema for parent
  }

  @Delete(':id')
  @HttpCode(204)
  async deactivate(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    const student = await this.studentService.findOne(studentId);

    const permission =
      await this.validationService.validateSchoolAdminPermission(
        request.user.sub,
        student.schoolId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view students in this school',
      );

    await this.studentService.deactivate(studentId);
    return { status: true, message: 'Student deactivated successfully' };
  }

  @Post(':id/activate')
  async activate(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    const student = await this.studentService.findOne(studentId);

    const permission =
      await this.validationService.validateSchoolAdminPermission(
        request.user.sub,
        student.schoolId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view students in this school',
      );

    await this.studentService.activate(studentId);
    return { status: true, message: 'Student activated successfully' };
  }
}
