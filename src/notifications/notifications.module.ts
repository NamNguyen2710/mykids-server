import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Global()
@Module({
  imports: [ConfigModule],
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
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class NotificationsModule {}
