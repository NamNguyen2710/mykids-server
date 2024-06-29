import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

import { Notifications } from './entities/notification.entity';
import { NotificationToken } from './entities/notification-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications, NotificationToken]),
    FirebaseModule,
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
