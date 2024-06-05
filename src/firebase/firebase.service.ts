import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendNotificationDTO } from 'src/notifications/dto/send-notification.dto';
import { Notifications } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

import * as admin from 'firebase-admin';
import { NotificationToken } from 'src/notifications/entities/notification-token.entity';

@Injectable()
export class FireBaseService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationRepo: Repository<Notifications>,
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendNotiFirebase(sendNotificationDTO: SendNotificationDTO) {
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

  async sendTestNoti() {
    this.firebaseAdmin.messaging().send({
      token:
        'dT6jTgdcRAmIrZDfbDNmbz:APA91bExpkzn_bsBCUmVilnz9txUFhLUsZaiB7OT4E2pOyuoUxFUcJjURPJmzky1QY_hhbpDEuRBML_20ygP8KM1GO-uI-Rdxq1o72FPk5LUaDJ6eH8aAatyauBzCnAq4-RIvVBYSQur',
      notification: {
        title: 'Testing',
        body: 'Test only',
      },
      data: { sub: '10' },
    });
  }

  private async removeInvalidToken(token: string) {
    const findToken = await this.notificationTokenRepo.findOne({
      where: {
        notificationToken: token,
      },
    });
    this.notificationTokenRepo.delete(findToken);
  }
}
