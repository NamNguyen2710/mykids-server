import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassModule } from 'src/class/class.module';

import { WorkHistories } from 'src/work-history/entities/work-history.entity';
import { WorkHistoryController } from 'src/work-history/work-history.controller';
import { WorkHistoryService } from 'src/work-history/work-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkHistories]), ClassModule],
  controllers: [WorkHistoryController],
  providers: [WorkHistoryService],
  exports: [WorkHistoryService],
})
export class WorkHistoryModule {}
