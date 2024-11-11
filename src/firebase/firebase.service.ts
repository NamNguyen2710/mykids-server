import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';

import { NotificationToken } from 'src/notifications/entities/notification-token.entity';
import { SendNotificationDto } from 'src/firebase/dto/send-notification.dto';

@Injectable()
export class FireBaseService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendNotiFirebase(sendNotificationDto: SendNotificationDto) {
    const { tokens, title, body, data } = sendNotificationDto;
    const payload = {
      notification: { title, body },
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
    } catch (error) {
      console.error('Error sending multicast message:', error);
    }
  }

  private async removeInvalidToken(token: string) {
    const findToken = await this.notificationTokenRepo.findOne({
      where: {
        notificationToken: token,
      },
    });
    this.notificationTokenRepo.delete(findToken);
  }

  // async sendTestNoti(token: string) {
  //   this.firebaseAdmin.messaging().send({
  //     token:
  //       'fDpxKQniQLqttguDXuDxIm:APA91bHrKVBbywkLvBNWiZUFSqPXcfK5InoncK50aZakqzyVdvDC92UVCOHdtxDiPIwU62g88VCNEyAWVDQjhUyIJXPajv81jcZe_uZ0EYL2UZ55bDnS8qnx1g0Kv1ckVeazy-fXLKrz',
  //     notification: {
  //       title: 'Testing',
  //       body: 'Test only',
  //     },
  //     data: { sub: '10' },
  //   });
  // }
}
