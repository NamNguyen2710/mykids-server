import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';

import { Posts } from './entities/post.entity';
import { Hashtags } from './entities/hashtag.entity';

import { ClassModule } from 'src/class/class.module';
import { BaseNotificationModule } from 'src/base-notification/base-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Hashtags]),
    ClassModule,
    BaseNotificationModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
