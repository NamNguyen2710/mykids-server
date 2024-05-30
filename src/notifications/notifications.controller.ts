import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SaveTokenDTO } from './dto/save-token.dto';
import { Public } from 'src/guard/public.decorator';
import { SendNotificationDTO } from './dto/send-notification.dto';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post('send')
  // async sendNotification(@Body() sendNotificationDto: SendNotificationDTO) {
  //   this.notificationsService.sendingNotification(sendNotificationDto);
  // }

  @Post('test')
  async sendTestNoti(@Body() token: string) {
    this.notificationsService.testNoti(token);
  }

  @Get('save')
  async saveNotificationToken(
    @Body() saveTokenDTO: SaveTokenDTO,
    @Request() request,
  ) {
    this.notificationsService.saveToken(request.user, saveTokenDTO);
  }
}
