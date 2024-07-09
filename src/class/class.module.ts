import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassHistoryService } from 'src/class/class-history.service';

import { Classrooms } from 'src/class/entities/class.entity';
import { ClassHistories } from 'src/class/entities/class-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classrooms, ClassHistories])],
  controllers: [ClassController],
  providers: [ClassService, ClassHistoryService],
  exports: [ClassService],
})
export class ClassModule {}
