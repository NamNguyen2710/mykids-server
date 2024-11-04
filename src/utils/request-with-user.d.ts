import { Request } from '@nestjs/common';
import { Users } from 'src/users/entity/users.entity';

export interface RequestWithUser extends Request {
  user: Users;
}
