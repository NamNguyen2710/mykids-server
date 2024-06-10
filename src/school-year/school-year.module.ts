import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchoolYearService } from './school-year.service';
import { SchoolYearController } from './school-year.controller';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolYears])],
  controllers: [SchoolYearController],
  providers: [SchoolYearService],
})
export class SchoolYearModule {}
