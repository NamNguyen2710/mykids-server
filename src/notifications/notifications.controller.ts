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
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { LoginGuard } from 'src/guard/login.guard';

import { SaveTokenDTO } from './dto/save-token.dto';
import {
  QueryNotiDTO,
  QueryNotiSchema,
} from 'src/notifications/dto/query-noti.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

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
  async getNotification(
    @Request() request,
    @Query(new ZodValidationPipe(QueryNotiSchema))
    notificationQuery: QueryNotiDTO,
  ) {
    return this.notificationsService.findAll(
      request.user.sub,
      notificationQuery,
    );
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
