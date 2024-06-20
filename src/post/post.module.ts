import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

import { Posts } from './entities/post.entity';
import { Hashtags } from './entities/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Hashtags]), NotificationsModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
