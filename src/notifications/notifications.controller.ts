import { Controller, Post, Body, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SaveTokenDTO } from './dto/save-token.dto';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-notification/')
  async sendNotidication(@Body() body: { token: string }) {
    const { token } = body;
  }

  @Post('save')
  async saveNotificationToken(
    @Request() request,
    @Body() saveTokenDTO: SaveTokenDTO,
  ) {
    this.notificationsService.saveToken(request.user, saveTokenDTO);
  }
}
