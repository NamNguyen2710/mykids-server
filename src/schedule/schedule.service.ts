import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Schedules } from 'src/schedule/entities/schedule.entity';
import { ScheduleDetailDto } from 'src/schedule/dto/schedule-detail.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
  ) {}

  async findSchedule(classId: number, startDate: Date, endDate: Date) {
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    const schedule = await this.scheduleRepository.find({
      where: {
        classroom: { id: classId },
        startTime: MoreThanOrEqual(startTime),
        endTime: LessThanOrEqual(endTime),
      },
    });
    return schedule;
  }

  async createSchedule(schedule: ScheduleDetailDto) {
    const newSchedule = this.scheduleRepository.create(schedule);
    await this.scheduleRepository.save(newSchedule);

    return newSchedule;
  }

  async updateSchedule(scheduleId: number, schedule: ScheduleDetailDto) {
    const res = await this.scheduleRepository.update(scheduleId, schedule);
    if (res.affected === 0) throw new BadRequestException('Schedule not found');

    return this.scheduleRepository.findOne({ where: { id: scheduleId } });
  }

  async deleteSchedule(scheduleId: number) {
    const res = await this.scheduleRepository.delete(scheduleId);
    if (res.affected === 0) throw new BadRequestException('Schedule not found');

    return true;
  }

  async validateSchoolAdminSchedulePermission(
    userId: number,
    scheduleId: number,
  ) {
    const schedule = await this.scheduleRepository.findOne({
      where: {
        id: scheduleId,
        classroom: { school: { schoolAdminId: userId } },
      },
    });

    return !!schedule;
  }
}
