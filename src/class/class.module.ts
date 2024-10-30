import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Classrooms } from 'src/class/entities/class.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

@Module({
  imports: [TypeOrmModule.forFeature([Classrooms])],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
