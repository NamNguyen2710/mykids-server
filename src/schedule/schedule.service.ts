import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Schedules } from 'src/schedule/entities/schedule.entities';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
  ) {}

  async findSchedule(userId: number, classId: number, date: Date = new Date()) {
    // TODO: Verify userId through student

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
}
