import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export interface ResponseCommentDto {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ResponseUserDto;
}
