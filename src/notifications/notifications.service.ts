import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FireBaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/users/users.service';

import { Notifications } from './entities/notification.entity';
import { NotificationToken } from './entities/notification-token.entity';

import { SaveTokenDto } from './dto/save-token.dto';
import { QueryNotiMeDTO } from './dto/query-noti-me.dto';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { CreateBulkNotificationDto } from 'src/notifications/dto/create-bulk-notification.dto';
import { UpdateBulkNotificationDto } from 'src/notifications/dto/update-bulk-notificatin.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(Notifications)
    private readonly notificationRepo: Repository<Notifications>,
    private readonly userService: UserService,
    private readonly firebaseService: FireBaseService,
  ) {}

  // Create and send bulk notifications
  async createBulkNotifications(notificationDto: CreateBulkNotificationDto) {
    const { data: users } = await this.userService.findAll(
      {
        schoolId: notificationDto.schoolId,
        classId: notificationDto.classId,
        roleId: notificationDto.roleId,
        limit: 1000,
      },
      ['notiTokens'],
    );

    const tokens = users
      .map((u) => u.notiTokens)
      .flat()
      .map((t) => t.notificationToken);

    this.firebaseService.sendNotiFirebase({
      tokens: tokens,
      title: notificationDto.title,
      body: notificationDto.body,
      data: notificationDto.data,
    });
    // TODO: Add send notification to PC

    const notifications = users.map((u) =>
      this.notificationRepo.create({
        ...notificationDto,
        userId: u.id,
      }),
    );
    await this.notificationRepo.save(notifications);

    return notifications;
  }

  async createNotification(notiDto: CreateNotificationDto) {
    const user = await this.userService.findOne(notiDto.userId, ['notiTokens']);
    if (!user)
      throw new BadRequestException('Sent notification user not found');

    const tokens = user.notiTokens.map((t) => t.notificationToken);

    this.firebaseService.sendNotiFirebase({
      tokens: tokens,
      title: notiDto.title,
      body: notiDto.body,
      data: notiDto.data,
    });

    const notification = this.notificationRepo.create(notiDto);
    await this.notificationRepo.save(notification);

    return notification;
  }

  async findAllByUser(userId: number, query: QueryNotiMeDTO) {
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
      where: { id: notificationId, userId },
    });

    return noti;
  }

  async markReadNotification(userId: number, notificationId: number) {
    const notification = await this.findOne(userId, notificationId);
    if (!notification) throw new NotFoundException('Notificaion not found');

    await this.notificationRepo.update(notificationId, { readStatus: true });
  }

  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.findOne(userId, notificationId);
    if (!notification) throw new NotFoundException('Notificaion not found');

    await this.notificationRepo.delete(notificationId);
  }

  async updateBulkNotification(notificationDto: UpdateBulkNotificationDto) {
    const notifications = await this.notificationRepo.find({
      where: { baseNotificationId: notificationDto.baseNotificationId },
    });

    notifications.forEach((n) => {
      n.title = notificationDto.title;
      n.body = notificationDto.body;
    });

    await this.notificationRepo.save(notifications);
    return notifications;
  }

  async deleteBulkNotification(baseNotificationId: number) {
    const notifications = await this.notificationRepo.find({
      where: { baseNotificationId },
    });

    await this.notificationRepo.remove(notifications);
  }

  async saveToken(userId: number, saveToken: SaveTokenDto) {
    const token = this.notificationTokenRepo.create({
      ...saveToken,
      userId: userId,
    });
    await this.notificationTokenRepo.save(token);
  }
}
