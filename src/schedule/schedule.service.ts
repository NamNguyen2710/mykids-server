import { Injectable } from '@nestjs/common';
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

  async findSchedule(classId: number, date: Date = new Date()) {
    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date);
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
    if (res.affected === 0) return null;

    return this.scheduleRepository.findOne({ where: { id: scheduleId } });
  }
}
