import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { LoginGuard } from 'src/guard/login.guard';

import { SaveTokenDTO } from './dto/save-token.dto';
import {
  QueryNotiDTO,
  QueryNotiSchema,
} from 'src/notifications/dto/query-noti.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { NotiResponseSchema } from 'src/notifications/dto/notification-response.dto';
import {
  SendNotificationSchema,
  SendNotificationDTO,
} from './dto/send-notification.dto';
import { UserService } from 'src/users/users.service';

@UseGuards(LoginGuard)
@Controller('notification')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UserService,
  ) {}

  @Post('send')
  async sendNotification(
    @Request() request,
    @Body(new ZodValidationPipe(SendNotificationSchema))
    sendNotificationDto: SendNotificationDTO,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      sendNotificationDto.schoolId,
    );
    if (!permission) {
      throw new ForbiddenException('You do not have permission');
    }

    this.notificationsService.createSchoolNotification(sendNotificationDto);
  }

  // @Post('test')
  // async sendTestNoti(@Body() token: string) {
  //   this.notificationsService.testNoti(token);
  // }

  @Post('save-token')
  async saveNotificationToken(
    @Body() saveTokenDTO: SaveTokenDTO,
    @Request() request,
  ) {
    await this.notificationsService.saveToken(request.user.sub, saveTokenDTO);
    return { status: true, message: 'Token saved' };
  }

  @Get()
  async getNotification(
    @Request() request,
    @Query(new ZodValidationPipe(QueryNotiSchema))
    notificationQuery: QueryNotiDTO,
  ) {
    const notis = await this.notificationsService.findAll(
      request.user.sub,
      notificationQuery,
    );
    return {
      ...notis,
      data: notis.data.map((noti) => NotiResponseSchema.parse(noti)),
    };
  }

  @Post(':notificationId/read')
  async readNotification(
    @Request() request,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    await this.notificationsService.readNotification(
      request.user.sub,
      notificationId,
    );
    return { status: true, message: 'Notification read' };
  }

  @Delete(':notificationId')
  @HttpCode(204)
  async deleteNotification(
    @Request() request,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    await this.notificationsService.deleteNotification(
      request.user.sub,
      notificationId,
    );
    return { status: true, message: 'Notification deleted' };
  }
}
