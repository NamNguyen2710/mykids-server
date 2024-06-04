import { Module } from '@nestjs/common';
import { SchoolYearService } from './school-year.service';
import { SchoolYearController } from './school-year.controller';

@Module({
  controllers: [SchoolYearController],
  providers: [SchoolYearService],
})
export class SchoolYearModule {}
