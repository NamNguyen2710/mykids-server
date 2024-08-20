import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FireBaseService } from 'src/firebase/firebase.service';

import { NotificationToken } from './entities/notification-token.entity';
import { Notifications } from './entities/notification.entity';
import { SaveTokenDTO } from './dto/save-token.dto';
import { QueryNotiDTO } from './dto/query-noti.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(Notifications)
    private readonly notificationRepo: Repository<Notifications>,
    private readonly firebaseService: FireBaseService,
  ) {}

  // async testNoti(token: string) {
  //   this.firebaseService.sendTestNoti(token);
  // }

  async createNotification(
    userId: number,
    title: string,
    body: string,
    data?: { [key: string]: string },
  ) {
    const notiTokens = await this.notificationTokenRepo.find({
      where: { userId: userId },
    });
    const notification = this.notificationRepo.create({
      userId: userId,
      title: title,
      body: body,
    });

    this.firebaseService.sendNotiFirebase({
      tokens: notiTokens.map((token) => token.notificationToken),
      notification: {
        title: title,
        body: body,
      },
      data: data,
    });

    await this.notificationRepo.save(notification);
  }

  // Create and send notification
  async createSchoolNotification(
    schoolId: number,
    title: string,
    body: string,
    data?: { [key: string]: string },
  ) {
    const getTokens = await this.notificationTokenRepo.find({
      where: { user: { schools: { id: schoolId } } },
    });

    // Get token as string array
    const tokens = getTokens.map((token) => token.notificationToken);

    // Create all notification add into array to save into db
    const notificationsData = getTokens.map((token) => {
      const notification = this.notificationRepo.create({
        userId: token.user.id,
        title: title,
        body: body,
      });
      return notification;
    });

    // Create notification payload
    const notification = {
      tokens: tokens,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };

    // Send notification
    this.firebaseService.sendNotiFirebase(notification);

    // Save notification
    this.notificationRepo.save(notificationsData);
  }

  async saveToken(userId: number, saveToken: SaveTokenDTO) {
    const token = this.notificationTokenRepo.create({
      ...saveToken,
      userId: userId,
    });
    await this.notificationTokenRepo.save(token);
  }

  async readNotification(userId: number, notificationId: number) {
    const notification = await this.findOne(userId, notificationId);
    if (!notification) throw new NotFoundException('Notificaion not found');

    await this.notificationRepo.update(notificationId, { readStatus: true });
  }

  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.findOne(userId, notificationId);
    if (!notification) throw new NotFoundException('Notificaion not found');

    await this.notificationRepo.delete(notificationId);
  }

  async findAll(userId: number, query: QueryNotiDTO) {
    const { limit = 20, page = 1 } = query;

    const [noti, total] = await this.notificationRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const unreadCount = await this.notificationRepo.countBy({
      userId: userId,
      readStatus: false,
    });

    return {
      data: noti,
      unreadCount,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  private async findOne(userId: number, notificationId: number) {
    const noti = await this.notificationRepo.findOne({
      where: { id: notificationId, user: { id: userId } },
    });

    return noti;
  }
}
