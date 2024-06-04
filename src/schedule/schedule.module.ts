import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Schedules } from 'src/schedule/entities/schedule.entities';
import { ScheduleController } from 'src/schedule/schedule.controller';
import { ScheduleService } from 'src/schedule/schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
