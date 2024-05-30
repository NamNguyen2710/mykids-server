import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDTO } from './dto/send-notification.dto';
import { Repository } from 'typeorm';
import { NotificationToken } from './entities/notification-token.entity';
import { SaveTokenDTO } from './dto/save-token.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendingNotification(sendNotificationDTO: SendNotificationDTO) {
    const { tokens, notification, data } = sendNotificationDTO;
    const payload = {
      notification,
      data,
    };

    try {
      const response = await this.firebaseAdmin
        .messaging()
        .sendEachForMulticast({
          tokens: tokens,
          notification: payload.notification,
          data: payload.data,
        });

      response.responses.forEach((res, index) => {
        if (!res.success) {
          const error = res.error;
          const failedToken = tokens[index];
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered'
          ) {
            console.error('Invalid or unregistered token:', failedToken);
            // Remove the token from your database
            this.removeInvalidToken(failedToken);
          } else {
            console.error('Error sending message to', failedToken, ':', error);
          }
        }
      });

      // console.log('Successfully sent messages:', response.successCount);
    } catch (error) {
      console.error('Error sending multicast message:', error);
    }
  }

  async saveToken(userId: number, saveToken: SaveTokenDTO) {
    saveToken.userId = userId;
    this.notificationTokenRepo.save(saveToken);
  }

  private removeInvalidToken(token: string) {
    // Logic to remove the invalid token database
    const findToken = this.notificationTokenRepo.findOne({
      where: {
        notificationToken: token,
      },
    });
    this.notificationTokenRepo.delete(findToken[0]);
  }
}
