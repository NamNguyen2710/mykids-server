import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassHistories } from 'src/class-history/entities/class-history.entity';
import { ClassHistoryController } from 'src/class-history/class-history.controller';
import { ClassHistoryService } from 'src/class-history/class-history.service';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassHistories]), ClassModule],
  controllers: [ClassHistoryController],
  providers: [ClassHistoryService],
  exports: [ClassHistoryService],
})
export class ClassHistoryModule {}
