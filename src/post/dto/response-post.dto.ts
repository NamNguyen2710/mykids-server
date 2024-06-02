import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export interface ResponsePostDto {
  id: number;
  schoolId: number;
  message: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  commentCount: number;
  likeCount: number;
  likedByUser?: boolean;
  createdBy: ResponseUserDto;
}
