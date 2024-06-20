import { Module } from '@nestjs/common';
import { LoaService } from './loa.service';
import { LoaController } from './loa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoaEntity } from './entities/loa.entity';
import { Schools } from 'src/school/entities/school.entity';
import { Users } from 'src/users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoaEntity, Users])],
  controllers: [LoaController],
  providers: [LoaService],
  exports: [LoaService],
})
export class LoaModule {}
