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
import { Role } from 'src/role/entities/roles.data';
import {
  CREATE_STUDENT_PERMISSION,
  DELETE_STUDENT_PERMISSION,
  READ_ALL_STUDENT_PERMISSION,
  READ_ASSIGNED_CLASS_STUDENT_PERMISSION,
  UPDATE_STUDENT_PERMISSION,
} from 'src/role/entities/permission.data';

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
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty?.schoolId,
          permissionId: CREATE_STUDENT_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to create a student in this school',
      );

    return this.studentService.create(
      request.user.faculty.schoolId,
      createStudentDto,
    );
  }

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryStudentSchema))
    query: QueryStudentDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: query.classId,
        allPermissionId: READ_ALL_STUDENT_PERMISSION,
        classPermissionId: READ_ASSIGNED_CLASS_STUDENT_PERMISSION,
      });
    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to view students in this school',
      );

    query.schoolId = request.user.faculty.schoolId;
    return this.studentService.findAll(query);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    let permission;

    if (request.user.roleId === Role.PARENT) {
      permission =
        await this.validationService.validateParentChildrenPermission(
          request.user.id,
          id,
        );
    } else {
      permission =
        (await this.validationService.validateSchoolFacultyPermission(
          request.user.id,
          { studentId: id, permissionId: READ_ALL_STUDENT_PERMISSION },
        )) ||
        (await this.validationService.validateSchoolFacultyClassPermission(
          request.user.id,
          {
            studentId: id,
            permissionId: READ_ASSIGNED_CLASS_STUDENT_PERMISSION,
          },
        ));
    }

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view this student',
      );

    const student = await this.studentService.findOne(id, [
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

    let permission;
    if (request.user.roleId === Role.PARENT) {
      permission =
        await this.validationService.validateParentChildrenPermission(
          request.user.id,
          studentId,
        );
    } else {
      permission = await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: student.schoolId,
          permissionId: UPDATE_STUDENT_PERMISSION,
        },
      );
    }
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this student',
      );

    const updatedStudent = await this.studentService.update(
      studentId,
      updateStudentDto,
    );
    return ResponseStudentSchema.parse(updatedStudent);
  }

  @Delete(':id')
  @HttpCode(204)
  async deactivate(
    @Request() request,
    @Param('id', ParseIntPipe) studentId: number,
  ) {
    const student = await this.studentService.findOne(studentId);

    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { schoolId: student.schoolId, permissionId: DELETE_STUDENT_PERMISSION },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this student',
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
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { schoolId: student.schoolId, permissionId: CREATE_STUDENT_PERMISSION },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access student',
      );

    await this.studentService.activate(studentId);
    return { status: true, message: 'Student activated successfully' };
  }
}
