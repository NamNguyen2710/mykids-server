export class SendNotificationDTO {
  tokens: string[];
  notification: {
    title: string;
    body: string;
  };
  data?: { [key: string]: string };
}
