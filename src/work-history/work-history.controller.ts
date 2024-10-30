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

import { LoginGuard } from 'src/guard/login.guard';
import { ClassService } from 'src/class/class.service';
import { ValidationService } from 'src/users/validation.service';
import { WorkHistoryService } from 'src/work-history/work-history.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  CreateWorkHistoryDto,
  CreateWorkHistorySchema,
} from 'src/work-history/dto/create-work-history.dto';
import {
  ADD_CLASS_FACULTY_PERMISSION,
  REMOVE_CLASS_FACULTY_PERMISSION,
  DELETE_WORK_HISTORY_PERMISSION,
} from 'src/role/entities/permission.data';

@Controller('class/:classId/faculty/:facultyId')
@UseGuards(LoginGuard)
export class WorkHistoryController {
  constructor(
    private readonly workHistoryService: WorkHistoryService,
    private readonly classService: ClassService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async addFaculty(
    @Request() request,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('facultyId', ParseIntPipe) facultyId: number,
    @Body(new ZodValidationPipe(CreateWorkHistorySchema))
    { startDate }: CreateWorkHistoryDto,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty.schoolId,
          permissionId: ADD_CLASS_FACULTY_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update faculty in this class',
      );

    const classroom = await this.classService.findOne(classId);
    if (!classroom.isActive)
      throw new BadRequestException('Class is not active');

    const workHistory = await this.workHistoryService.findOne(
      classId,
      facultyId,
    );
    if (workHistory && workHistory.endDate === null)
      throw new BadRequestException('Faculty is already in class');

    return this.workHistoryService.startWorkHistory(
      classId,
      facultyId,
      startDate,
    );
  }

  @Put('end')
  async removeFaculty(
    @Request() request,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('facultyId', ParseIntPipe) facultyId: number,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty.schoolId,
          permissionId: REMOVE_CLASS_FACULTY_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update faculty in this class',
      );

    const classroom = await this.classService.findOne(classId);
    if (!classroom.isActive)
      throw new BadRequestException('Class is not active');

    return this.workHistoryService.endWorkHistory(classId, facultyId);
  }

  @Delete()
  @HttpCode(204)
  async delete(
    @Request() request,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('facultyId', ParseIntPipe) facultyId: number,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty.schoolId,
          permissionId: DELETE_WORK_HISTORY_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update faculty in this class',
      );

    return this.workHistoryService.delete(classId, facultyId);
  }
}
