import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
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
import * as Role from 'src/users/entity/roles.data';
import { UpdateScheduleDto } from 'src/schedule/dto/update-schedule.dto';
import { Users } from 'src/users/entity/users.entity';

@Controller('schedule')
@UseGuards(LoginGuard)
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async getSchedule(
    @Request() request,
    @Query(new ZodValidationPipe(QueryScheduleSchema)) query: QueryScheduleDto,
  ) {
    let permission: Users | null = null;
    if (request.user.role === Role.Parent.name)
      permission = await this.validationService.validateParentClassPermission(
        request.user.sub,
        query.classId,
      );
    if (request.user.role === Role.SchoolAdmin.name)
      permission =
        await this.validationService.validateSchoolAdminClassPermission(
          request.user.sub,
          query.classId,
        );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to get this class schedule',
      );

    return this.scheduleService.findSchedule(
      query.classId,
      query.startDate || query.date || new Date(),
      query.endDate || query.date || new Date(),
    );
  }

  @Post()
  async createSchedule(
    @Request() request,
    @Body(new ZodValidationPipe(ScheduleDetailSchema)) body: ScheduleDetailDto,
  ) {
    const permission =
      await this.validationService.validateSchoolAdminClassPermission(
        request.user.sub,
        body.classId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to create schedule for this class',
      );

    return this.scheduleService.createSchedule(body);
  }

  @Put(':id')
  async updateSchedule(
    @Request() request,
    @Body(new ZodValidationPipe(ScheduleDetailSchema)) body: UpdateScheduleDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const permission =
      await this.scheduleService.validateSchoolAdminSchedulePermission(
        request.user.sub,
        id,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update schedule for this class',
      );

    const schedule = await this.scheduleService.updateSchedule(id, body);
    return schedule;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSchedule(
    @Request() request,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const permission =
      await this.validationService.validateSchoolAdminClassPermission(
        request.user.sub,
        id,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to delete schedule for this class',
      );

    return this.scheduleService.deleteSchedule(id);
  }
}
