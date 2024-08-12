import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassModule } from 'src/class/class.module';

import { Schedules } from 'src/schedule/entities/schedule.entity';
import { ScheduleController } from 'src/schedule/schedule.controller';
import { ScheduleService } from 'src/schedule/schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules]), ClassModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
