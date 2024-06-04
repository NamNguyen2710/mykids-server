import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { ScheduleService } from 'src/schedule/schedule.service';

@Controller('schedule')
@UseGuards(LoginGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getSchedule(@Request() request, @Query() query) {
    return this.scheduleService.findSchedule(
      request.user.sub,
      query.classId,
      query.date ? new Date(query.date) : new Date(),
    );
  }
}
