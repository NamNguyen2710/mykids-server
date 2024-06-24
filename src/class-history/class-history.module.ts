import { Module } from '@nestjs/common';
import { ClassHistoryService } from './class-history.service';
import { ClassHistoryController } from './class-history.controller';

@Module({
  controllers: [ClassHistoryController],
  providers: [ClassHistoryService],
})
export class ClassHistoryModule {}
