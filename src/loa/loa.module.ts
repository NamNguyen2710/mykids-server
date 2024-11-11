import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoaService } from './loa.service';
import { LoaController } from './loa.controller';
import { Loa } from './entities/loa.entity';

import { ClassModule } from 'src/class/class.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loa]), ClassModule, NotificationsModule],
  controllers: [LoaController],
  providers: [LoaService],
  exports: [LoaService],
})
export class LoaModule {}
