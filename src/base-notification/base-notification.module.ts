import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseNotificationController } from './base-notification.controller';
import { BaseNotificationService } from './base-notification.service';
import { BaseNotifications } from './entities/base-notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([BaseNotifications]), NotificationsModule],
  controllers: [BaseNotificationController],
  providers: [BaseNotificationService],
  exports: [BaseNotificationService],
})
export class BaseNotificationModule {}
