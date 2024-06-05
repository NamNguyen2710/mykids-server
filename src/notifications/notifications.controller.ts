import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SaveTokenDTO } from './dto/save-token.dto';
// import { SendNotificationDTO } from './dto/send-notification.dto';
import { LoginGuard } from 'src/guard/login.guard';

@UseGuards(LoginGuard)
@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post('send')
  // async sendNotification(@Body() sendNotificationDto: SendNotificationDTO) {
  //   this.notificationsService.sendingNotification(sendNotificationDto);
  // }

  @Post('test')
  async sendTestNoti() {
    this.notificationsService.testNoti();
  }

  @Get('save')
  async saveNotificationToken(
    @Body() saveTokenDTO: SaveTokenDTO,
    @Request() request,
  ) {
    this.notificationsService.saveToken(request.user.sub, saveTokenDTO);
  }

  @Get('all')
  async getNotification(@Request() request) {}

  @Post(':notificationId/read')
  async readNotification(
    @Request() request,
    @Param('notificationid') notificationId: number,
  ) {
    this.notificationsService.readNotification(
      request.user.sub,
      notificationId,
    );
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Request() request,
    @Param('notificationId') notificationId: number,
  ) {
    this.notificationsService.deleteNotification(
      request.user.sub,
      notificationId,
    );
  }
}
