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
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { LoginGuard } from 'src/guard/login.guard';

import { SaveTokenDTO } from './dto/save-token.dto';
import { QueryNotiSchema } from 'src/notifications/dto/query-noti.dto';

@UseGuards(LoginGuard)
@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post('send')
  // async sendNotification(@Body() sendNotificationDto: SendNotificationDTO) {
  //   this.notificationsService.sendingNotification(sendNotificationDto);
  // }

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
  async getNotification(@Request() request, @Query() query) {
    const notificationQuery = QueryNotiSchema.parse(query);
    return this.notificationsService.findAll(
      request.user.sub,
      notificationQuery,
    );
  }

  @Post(':notificationId/read')
  async readNotification(
    @Request() request,
    @Param('notificationid') notificationId: number,
  ) {
    await this.notificationsService.readNotification(
      request.user.sub,
      notificationId,
    );
    return { status: true, message: 'Notification read' };
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Request() request,
    @Param('notificationId') notificationId: number,
  ) {
    await this.notificationsService.deleteNotification(
      request.user.sub,
      notificationId,
    );
    return { status: true, message: 'Notification deleted' };
  }
}
