import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SendNotificationDTO } from './dto/send-notification.dto';
import { Repository } from 'typeorm';
import { NotificationToken } from './entities/notification-token.entity';
import { SaveTokenDTO } from './dto/save-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { QueryNotiDTO } from './dto/query-noti.dto';
import { Users } from 'src/users/entity/users.entity';
import { FireBaseService } from 'src/firebase/firebase.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(Notifications)
    private readonly notificationRepo: Repository<Notifications>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly firebaseService: FireBaseService,
  ) {}

  async testNoti() {
    this.firebaseService.sendTestNoti();
  }

  // async createNotification(userId: number, title: string, body: string) {
  //   if (!userId) throw new UnauthorizedException('Not Authorized');
  //   const user = await this.userRepo.findOne({ where: { id: userId } });

  //   if (!user) throw new NotFoundException('User not found');
  // }

  async sendingNotification(sendNotificationDTO: SendNotificationDTO) {
    this.firebaseService.sendNotiFirebase(sendNotificationDTO);
  }

  async saveToken(userId: number, saveToken: SaveTokenDTO) {
    saveToken.userId = userId;
    this.notificationTokenRepo.save(saveToken);
  }

  async readNotification(userId: number, notificationId: number) {
    if (!userId) throw new UnauthorizedException('Not Authorized');
    if (!this.findOneNoti(userId, notificationId))
      throw new NotFoundException('Notificaion not found');
    this.notificationRepo.update(notificationId, { readStatus: true });
  }

  async deleteNotification(userId: number, notificationId: number) {
    if (!userId) throw new UnauthorizedException('Not Authorized');
    if (!this.findOneNoti(userId, notificationId))
      throw new NotFoundException('Notificaion not found');
    this.notificationRepo.delete(notificationId);
  }

  async getAllNotification(userId: number, query: QueryNotiDTO) {
    const { limit = 20, page = 1 } = query;
    if (!userId) throw new UnauthorizedException('Not Authorized');

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const [noti, total] = await this.notificationRepo.findAndCount({
      where: { users: user },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: { users: true },
    });

    // Query builder to count all posts
    const qb = this.notificationRepo.countBy({ readStatus: false });

    return {
      data: noti,
      pagination: {
        total: total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  private findOneNoti(userId: number, notificationId: number) {
    const noti = this.notificationRepo.findOne({
      where: { id: notificationId, users: { id: userId } },
      relations: { users: true },
    });
    if (!noti) return false;
  }
}
