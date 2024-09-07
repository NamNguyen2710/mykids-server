import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';
import { Medicals } from './entities/medical.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medicals])],
  controllers: [MedicalController],
  providers: [MedicalService],
  exports: [MedicalService],
})
export class MedicalModule {}
