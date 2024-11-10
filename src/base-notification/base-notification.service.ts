import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';

import {
  BaseNotifications,
  NOTIFICATION_STATUS,
} from './entities/base-notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

import { ConfigedQueryBaseNotiDto } from './dto/query-base-notification.dto';
import { CreateBaseNotificationDto } from 'src/base-notification/dto/create-base-notification.dto';
import { UpdateBaseNotificationDto } from './dto/update-base-notification.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BaseNotificationService {
  constructor(
    @InjectRepository(BaseNotifications)
    private readonly baseNotificationRepo: Repository<BaseNotifications>,
    private readonly notificationService: NotificationsService,
  ) {}

  async findAll(query: ConfigedQueryBaseNotiDto) {
    const { limit = 20, page = 1 } = query;

    const whereClause: FindOptionsWhere<BaseNotifications> = {};

    if (query.schoolId) whereClause.schoolId = query.schoolId;
    if (query.classId) whereClause.classId = query.classId;

    const [noti, total] = await this.baseNotificationRepo.findAndCount({
      where: whereClause,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: noti,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async findOne(baseNotiId: number) {
    const noti = await this.baseNotificationRepo.findOne({
      where: { id: baseNotiId },
    });

    return noti;
  }

  async create(createNotiDto: CreateBaseNotificationDto) {
    const baseNotification = this.baseNotificationRepo.create({
      ...createNotiDto,
      publishedAt:
        createNotiDto.status === NOTIFICATION_STATUS.PUBLISHED
          ? new Date()
          : createNotiDto.publishedAt,
    });
    await this.baseNotificationRepo.save(baseNotification);

    if (createNotiDto.status === NOTIFICATION_STATUS.PUBLISHED) {
      this.notificationService.createBulkNotifications({
        schoolId: baseNotification.schoolId,
        classId: baseNotification.classId,
        roleId: baseNotification.roleId,
        title: baseNotification.title,
        body: baseNotification.body,
        data: baseNotification.data,
        baseNotificationId: baseNotification.id,
      });
    }

    return baseNotification;
  }

  async update(baseNotiId: number, updateNotiDto: UpdateBaseNotificationDto) {
    const noti = await this.baseNotificationRepo.findOne({
      where: { id: baseNotiId },
    });
    if (!noti) throw new BadRequestException('Cannot find notification!');

    if (updateNotiDto.status === NOTIFICATION_STATUS.PUBLISHED) {
      if (noti.status !== NOTIFICATION_STATUS.PUBLISHED) {
        updateNotiDto.publishedAt = new Date();
        this.notificationService.createBulkNotifications({
          schoolId: noti.schoolId,
          classId: noti.classId,
          roleId: noti.roleId,
          baseNotificationId: noti.id,
          title: noti.title,
          body: noti.body,
          data: noti.data,
        });
      } else {
        if (noti.classId !== updateNotiDto.classId)
          throw new BadRequestException(
            'Cannot change class of published notification!',
          );
        if (noti.roleId !== updateNotiDto.roleId)
          throw new BadRequestException(
            'Cannot change receiver of published notification!',
          );

        if (
          (updateNotiDto.title !== undefined &&
            noti.title !== updateNotiDto.title) ||
          (updateNotiDto.body !== undefined && noti.body !== updateNotiDto.body)
        )
          this.notificationService.updateBulkNotification({
            baseNotificationId: noti.id,
            title: updateNotiDto.title || noti.title,
            body: updateNotiDto.body || noti.body,
          });
      }
    } else if (updateNotiDto.status === NOTIFICATION_STATUS.RETRACTED) {
      this.notificationService.deleteBulkNotification(noti.id);
    }

    await this.baseNotificationRepo.save({
      ...noti,
      ...updateNotiDto,
    });

    return noti;
  }

  @Cron('*/1 * * * *')
  async publishScheduledNotification() {
    const notis = await this.baseNotificationRepo.find({
      where: {
        status: NOTIFICATION_STATUS.UNPUBLISHED,
        publishedAt: LessThanOrEqual(new Date()),
      },
    });

    notis.forEach((noti) => {
      this.update(noti.id, { status: NOTIFICATION_STATUS.PUBLISHED });
    });
  }
}
