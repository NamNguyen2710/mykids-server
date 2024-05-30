import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { NotificationToken } from './entities/notification-token.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notifications, NotificationToken]),
  ],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        // Resolve the path to the service account JSON file
        const serviceAccountPath = path.resolve(
          __dirname,
          '../../src/config/serviceAccountKey.json',
        );
        // Load the service account JSON file
        const serviceAccount = require(serviceAccountPath);
        // Initialize the Firebase Admin SDK
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
      inject: [ConfigService],
    },
    NotificationsService,
  ],
  controllers: [NotificationsController],
  exports: ['FIREBASE_ADMIN'],
})
export class NotificationsModule {}
