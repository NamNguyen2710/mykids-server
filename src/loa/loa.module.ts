import { Module } from '@nestjs/common';
import { LoaService } from './loa.service';
import { LoaController } from './loa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loa } from './entities/loa.entity';
import { Users } from 'src/users/entity/users.entity';
import { ClassHistories } from 'src/class-history/entities/class-history.entity';
import { Students } from 'src/student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loa, Users, ClassHistories, Students])],
  controllers: [LoaController],
  providers: [LoaService],
  exports: [LoaService],
})
export class LoaModule {}
