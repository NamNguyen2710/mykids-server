import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDTO } from './dto/send-notification.dto';
import { In, Repository } from 'typeorm';
import { NotificationToken } from './entities/notification-token.entity';
import { SaveTokenDTO } from './dto/save-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { QueryNotiDTO } from './dto/query-noti.dto';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(Notifications)
    private readonly notificationRepo: Repository<Notifications>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async testNoti(token: string) {
    this.firebaseAdmin.messaging().send({
      token: token,
      notification: {
        title: 'Testing',
        body: 'Test only',
      },
    });
  }

  // async createNotification(userId: number, title: string, body: string) {
  //   if (!userId) throw new UnauthorizedException('Not Authorized');
  //   const user = await this.userRepo.findOne({ where: { id: userId } });

  //   if (!user) throw new NotFoundException('User not found');
  // }

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

  async readNotification(userId: number, notificationId: number) {
    if (!userId) throw new UnauthorizedException('Not Authorized');
    if (!this.findOneNoti) throw new NotFoundException('Notificaion not found');
    this.notificationRepo.update(notificationId, { readStatus: true });
  }

  async deleteNotification(userId: number, notificationId: number) {
    if (!userId) throw new UnauthorizedException('Not Authorized');
    if (!this.findOneNoti) throw new NotFoundException('Notificaion not found');
    this.notificationRepo.softDelete(notificationId);
  }

  async getAllNotification(userId: number, query: QueryNotiDTO) {
    const { limit = 20, page = 1 } = query;
    if (!userId) throw new UnauthorizedException('Not Authorized');

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { notification: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const notificationId = user.notification.map(
      (notification) => notification.id,
    );

    if (!userId && notificationId.length == 0)
      return {
        data: [],
        pagination: { totalItem: 0, totalPage: 0, page, limit },
      };

    // Query builder to get all posts
    const qb = this.notificationRepo.createQueryBuilder('notification');

    if (userId) {
      qb.where('notification.user_id = :userId', { userId });
    }

    const rawNotis = await qb
      .leftJoinAndSelect('notification.user', 'notification_user')
      .groupBy('notification.readStatus')
      .orderBy('notification.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();
    if (!rawNotis) throw new NotFoundException();

    const notification = rawNotis.map((notification) => ({
      id: notification.notification_notification_id,
      title: notification.notification_title,
      body: notification.notification_body,
      createdAt: notification.notification_created_at,
      readStatus: notification.read_status,
    }));

    // Get total count of unread noti
    const totalUnreadNoti = await this.notificationRepo.count({
      where: { readStatus: false, users: user },
      relations: { users: true },
    });

    const total = await this.notificationRepo.countBy({
      users: user,
    });

    return {
      data: notification,
      pagination: {
        totalUnreadNoti: totalUnreadNoti,
        total: total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  private async removeInvalidToken(token: string) {
    // Logic to remove the invalid token database
    const findToken = await this.notificationTokenRepo.findOne({
      where: {
        notificationToken: token,
      },
    });
    this.notificationTokenRepo.delete(findToken);
  }

  private findOneNoti(userId: number, notificationId: number) {
    const noti = this.notificationRepo.findOne({
      where: { id: notificationId, users: { id: userId } },
      relations: { users: true },
    });
    if (!noti) return false;
  }
}
