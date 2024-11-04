import {
  Controller,
  Post,
  Put,
  Delete,
  Request,
  Param,
  Body,
  ForbiddenException,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { ClassService } from 'src/class/class.service';
import { ValidationService } from 'src/users/validation.service';
import { ClassHistoryService } from 'src/class-history/class-history.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  UpdateClassHistoryDto,
  UpdateClassHistorySchema,
} from 'src/class-history/dto/update-class-history.dto';
import {
  CreateClassHistoriesDto,
  CreateClassHistoriesSchema,
} from 'src/class-history/dto/create-class-histories.dto';

import {
  ADD_ASSIGNED_CLASS_STUDENT_PERMISSION,
  ADD_CLASS_STUDENT_PERMISSION,
  REMOVE_ASSIGNED_CLASS_STUDENT_PERMISSION,
  REMOVE_CLASS_STUDENT_PERMISSION,
  UPDATE_ASSIGNED_CLASS_STUDENT_PERMISSION,
  UPDATE_CLASS_STUDENT_PERMISSION,
  DELETE_CLASS_HISTORY_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('class/:classId/student')
@UseGuards(LoginGuard)
export class ClassHistoryController {
  constructor(
    private readonly classHistoryService: ClassHistoryService,
    private readonly classService: ClassService,
    private readonly validationService: ValidationService,
  ) {}

  @Post('')
  async addStudents(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Body(new ZodValidationPipe(CreateClassHistoriesSchema))
    body: CreateClassHistoriesDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId,
        allPermissionId: ADD_CLASS_STUDENT_PERMISSION,
        classPermissionId: ADD_ASSIGNED_CLASS_STUDENT_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update student in this class',
      );

    const classroom = await this.classService.findOne(classId);
    if (!classroom.isActive)
      throw new BadRequestException('Class is not active');

    const studentsHasClass = await this.classHistoryService.findByStudentIds(
      body.studentIds,
    );
    if (studentsHasClass.length > 0)
      throw new BadRequestException('Student has class');

    return this.classHistoryService.startClassHistories(
      classId,
      body.studentIds,
      body.startDate,
    );
  }

  @Put(':studentId')
  async updateStudent(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(UpdateClassHistorySchema))
    updateDto: UpdateClassHistoryDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId,
        allPermissionId: UPDATE_CLASS_STUDENT_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_STUDENT_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update student in this class',
      );

    const classroom = await this.classService.findOne(classId);
    if (!classroom.isActive)
      throw new BadRequestException('Class is not active');

    return this.classHistoryService.update(classId, studentId, updateDto);
  }

  @Put(':studentId/remove')
  async removeStudent(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId,
        allPermissionId: REMOVE_CLASS_STUDENT_PERMISSION,
        classPermissionId: REMOVE_ASSIGNED_CLASS_STUDENT_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update student in this class',
      );

    const classroom = await this.classService.findOne(classId);
    if (!classroom.isActive)
      throw new BadRequestException('Class is not active');

    return this.classHistoryService.endClassHistory(classId, studentId);
  }

  @Delete(':studentId')
  @HttpCode(204)
  async delete(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty?.schoolId,
          permissionId: DELETE_CLASS_HISTORY_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to delete class history',
      );

    return this.classHistoryService.delete(classId, studentId);
  }
}
