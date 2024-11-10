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
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { SaveTokenDto, SaveTokenSchema } from './dto/save-token.dto';
import {
  QueryNotiMeDTO,
  QueryNotiMeSchema,
} from 'src/notifications/dto/query-noti-me.dto';
import { NotiResponseSchema } from 'src/notifications/dto/notification-response.dto';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('save-token')
  async saveNotificationToken(
    @Request() request: RequestWithUser,
    @Body(new ZodValidationPipe(SaveTokenSchema))
    saveTokenDTO: SaveTokenDto,
  ) {
    await this.notificationsService.saveToken(request.user.id, saveTokenDTO);
    return { status: true, message: 'Token saved' };
  }

  @Get()
  async getMyNotification(
    @Request() request: RequestWithUser,
    @Query(new ZodValidationPipe(QueryNotiMeSchema))
    notificationQuery: QueryNotiMeDTO,
  ) {
    const notis = await this.notificationsService.findAllByUser(
      request.user.id,
      notificationQuery,
    );
    return {
      ...notis,
      data: notis.data.map((noti) => NotiResponseSchema.parse(noti)),
    };
  }

  @Post(':notificationId/read')
  async markReadNotification(
    @Request() request: RequestWithUser,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    await this.notificationsService.markReadNotification(
      request.user.id,
      notificationId,
    );
    return { status: true, message: 'Notification read' };
  }

  @Delete(':notificationId')
  @HttpCode(204)
  async deleteNotification(
    @Request() request: RequestWithUser,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    await this.notificationsService.deleteNotification(
      request.user.id,
      notificationId,
    );
    return { status: true, message: 'Notification deleted' };
  }
}
