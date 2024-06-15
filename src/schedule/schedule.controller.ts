import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { ScheduleDetailDto } from 'src/schedule/dto/schedule-detail.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { UserService } from 'src/users/users.service';

@Controller('schedule')
@UseGuards(LoginGuard)
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getSchedule(@Request() request, @Query() query) {
    const classId = parseInt(query.classId, 10);
    if (!classId) throw new BadRequestException('Invalid class id');

    const validate = await this.userService.validateParentClassPermission(
      request.user.sub,
      classId,
    );
    if (!validate) throw new UnauthorizedException('Unauthorized');

    return this.scheduleService.findSchedule(
      classId,
      query.date ? new Date(query.date) : new Date(),
    );
  }

  @Post()
  async createSchedule(@Request() request, @Body() body: ScheduleDetailDto) {
    return this.scheduleService.createSchedule(body);
  }

  @Put(':id')
  async updateSchedule(
    @Request() request,
    @Body() body: ScheduleDetailDto,
    @Query('id') id: number,
  ) {
    const schedule = await this.scheduleService.updateSchedule(id, body);
    if (!schedule) throw new BadRequestException('Invalid schedule id');

    return schedule;
  }
}
