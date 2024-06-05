import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { NotificationToken } from './entities/notification-token.entity';
import { FirebaseModule } from '../firebase/firebase.module';
import { Users } from 'src/users/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications, NotificationToken, Users]),
    FirebaseModule,
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
