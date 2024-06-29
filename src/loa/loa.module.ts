import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoaService } from './loa.service';
import { LoaController } from './loa.controller';

import { Loa } from './entities/loa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loa])],
  controllers: [LoaController],
  providers: [LoaService],
  exports: [LoaService],
})
export class LoaModule {}
