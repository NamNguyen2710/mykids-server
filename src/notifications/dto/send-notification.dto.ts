import { NotificationToken } from '../entities/notification-token.entity';

export class SendNotificationDTO {
  tokens: string[];
  notification: {
    title: string;
    body: string;
  };
  data?: { [key: string]: string };
}
