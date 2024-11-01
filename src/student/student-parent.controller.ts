import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  ForbiddenException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { StudentService } from './student.service';
import { StudentParentService } from './student-parent.service';
import { ValidationService } from 'src/users/validation.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

import { ResponseStdWithParentSchema } from 'src/student/dto/response-student.dto';
import { ResponseStudentParentSchema } from 'src/student/dto/response-student-parent.dto';
import { CreateParentDto, CreateParentSchema } from './dto/create-parent.dto';
import {
  UpdateParentDto,
  UpdateParentSchema,
} from 'src/student/dto/update-parent.dto';
import {
  CREATE_PARENT_PERMISSION,
  DELETE_PARENT_PERMISSION,
  READ_ALL_STUDENT_PERMISSION,
  READ_ASSIGNED_CLASS_STUDENT_PERMISSION,
  UPDATE_PARENT_PERMISSION,
} from 'src/role/entities/permission.data';

@Controller('student/:studentId/parent')
@UseGuards(LoginGuard)
export class StudentParentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly studentParentService: StudentParentService,
    private readonly validationService: ValidationService,
  ) {}

  @Get('')
  async findParents(
    @Request() request,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    const permission =
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { studentId, permissionId: READ_ALL_STUDENT_PERMISSION },
      )) ||
      (await this.validationService.validateSchoolFacultyClassPermission(
        request.user.id,
        {
          studentId,
          permissionId: READ_ASSIGNED_CLASS_STUDENT_PERMISSION,
        },
      ));

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view this student',
      );

    const student = await this.studentService.findOne(studentId, [
      'parents.parent.user',
    ]);
    return ResponseStdWithParentSchema.parse(student).parents;
  }

  @Post('')
  async addStudentParent(
    @Request() request,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(CreateParentSchema))
    createParentDto: CreateParentDto,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { studentId, permissionId: CREATE_PARENT_PERMISSION },
      );

    if (!permission) {
      throw new ForbiddenException(
        'You do not have permission to create parent users',
      );
    }

    const newParent = await this.studentParentService.create(
      studentId,
      createParentDto,
    );
    return ResponseStudentParentSchema.parse(newParent);
  }

  @Put(':parentId')
  async updateStudentParent(
    @Request() request,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
    @Body(new ZodValidationPipe(UpdateParentSchema))
    createParentDto: UpdateParentDto,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { studentId, permissionId: UPDATE_PARENT_PERMISSION },
      );

    if (!permission) {
      throw new ForbiddenException(
        'You do not have permission to update parent users',
      );
    }

    const updatedParent = await this.studentParentService.update(
      parentId,
      studentId,
      createParentDto,
    );
    return ResponseStudentParentSchema.parse(updatedParent);
  }

  @Delete(':parentId')
  @HttpCode(204)
  async removeStudentParent(
    @Request() request,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { studentId: studentId, permissionId: DELETE_PARENT_PERMISSION },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to delete parent users',
      );

    await this.studentParentService.delete(parentId, studentId);
  }
}
