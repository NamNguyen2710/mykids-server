import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { ScheduleService } from 'src/schedule/schedule.service';
import { UserService } from 'src/users/users.service';
import { ClassService } from 'src/class/class.service';

import {
  QueryScheduleDto,
  QueryScheduleSchema,
} from 'src/schedule/dto/query-schedule.dto';
import {
  ScheduleDetailDto,
  ScheduleDetailSchema,
} from 'src/schedule/dto/schedule-detail.dto';

@Controller('schedule')
@UseGuards(LoginGuard)
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly userService: UserService,
    private readonly classService: ClassService,
  ) {}

  @Get()
  async getSchedule(
    @Request() request,
    @Query(new ZodValidationPipe(QueryScheduleSchema)) query: QueryScheduleDto,
  ) {
    const validate =
      (await this.userService.validateParentClassPermission(
        request.user.sub,
        query.classId,
      )) ||
      (await this.classService.validateTeacherClass(
        request.user.sub,
        query.classId,
      ));
    if (!validate)
      throw new UnauthorizedException(
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
    return this.scheduleService.createSchedule(body);
  }

  @Put(':id')
  async updateSchedule(
    @Request() request,
    @Body(new ZodValidationPipe(ScheduleDetailSchema)) body: ScheduleDetailDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const schedule = await this.scheduleService.updateSchedule(id, body);
    if (!schedule) throw new BadRequestException('Invalid schedule id');

    return schedule;
  }
}
