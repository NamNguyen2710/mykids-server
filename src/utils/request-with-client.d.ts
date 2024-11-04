import { Request } from '@nestjs/common';
import { AppClients } from 'src/auth/entities/client.entity';

export interface RequestWithClient extends Request {
  client: AppClients;
}
