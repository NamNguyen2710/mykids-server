import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseNotificationController } from 'src/base-notification/base-notification.controller';
import { BaseNotificationService } from 'src/base-notification/base-notification.service';
import { BaseNotifications } from 'src/base-notification/entities/base-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseNotifications])],
  controllers: [BaseNotificationController],
  providers: [BaseNotificationService],
  exports: [],
})
export class BaseNotificationModule {}
