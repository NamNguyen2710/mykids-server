import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostInfo } from 'src/entities/post_info.entity';
import { UserService } from 'src/users/users.service';
import { Users } from 'src/users/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostInfo,
      Users
    ])
  ],
  controllers: [PostController],
  providers: [PostService, UserService],
  exports: [PostService],
})
export class PostModule {}
