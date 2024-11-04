import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { ScheduleService } from 'src/schedule/schedule.service';
import { ValidationService } from 'src/users/validation.service';

import {
  QueryScheduleDto,
  QueryScheduleSchema,
} from 'src/schedule/dto/query-schedule.dto';
import {
  ScheduleDetailDto,
  ScheduleDetailSchema,
} from 'src/schedule/dto/schedule-detail.dto';
import { UpdateScheduleDto } from 'src/schedule/dto/update-schedule.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  CREATE_CLASS_SCHEDULE_PERMISSION,
  CREATE_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
  DELETE_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
  DELETE_CLASS_SCHEDULE_PERMISSION,
  READ_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
  READ_CLASS_SCHEDULE_PERMISSION,
  UPDATE_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
  UPDATE_CLASS_SCHEDULE_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('class/:classId/schedule')
@UseGuards(LoginGuard)
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async getSchedule(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Query(new ZodValidationPipe(QueryScheduleSchema))
    query: QueryScheduleDto,
  ) {
    let permission;
    if (request.user.roleId === Role.PARENT) {
      permission = await this.validationService.validateParentClassPermission(
        request.user.id,
        classId,
      );
    } else {
      const { classPermission, allPermission } =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: request.user.id,
          schoolId: request.user.faculty?.schoolId,
          classId,
          allPermissionId: READ_CLASS_SCHEDULE_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
        });
      permission = classPermission || allPermission;
    }
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view this class schedule',
      );

    return this.scheduleService.findSchedule(
      classId,
      query.startDate || query.date || new Date(),
      query.endDate || query.date || new Date(),
    );
  }

  @Post()
  async createSchedule(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Body(new ZodValidationPipe(ScheduleDetailSchema))
    body: ScheduleDetailDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId,
        allPermissionId: CREATE_CLASS_SCHEDULE_PERMISSION,
        classPermissionId: CREATE_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
      });
    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to create schedule for this class',
      );

    return this.scheduleService.createSchedule(classId, body);
  }

  @Put(':id')
  async updateSchedule(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(ScheduleDetailSchema))
    body: UpdateScheduleDto,
  ) {
    const oldSchedule = await this.scheduleService.findOne(id);

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: oldSchedule.classroom.id,
        allPermissionId: UPDATE_CLASS_SCHEDULE_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update schedule for this class',
      );

    const schedule = await this.scheduleService.updateSchedule(id, body);
    return schedule;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSchedule(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const oldSchedule = await this.scheduleService.findOne(id);

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: oldSchedule.classroom.id,
        allPermissionId: DELETE_CLASS_SCHEDULE_PERMISSION,
        classPermissionId: DELETE_ASSIGNED_CLASS_SCHEDULE_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to delete schedule for this class',
      );

    return this.scheduleService.deleteSchedule(id);
  }
}
