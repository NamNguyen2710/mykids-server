import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { FireBaseService } from './firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationToken } from 'src/notifications/entities/notification-token.entity';
import { Notifications } from 'src/notifications/entities/notification.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NotificationToken, Notifications]),
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
    FireBaseService,
  ],
  exports: ['FIREBASE_ADMIN', FireBaseService],
})
export class FirebaseModule {}
