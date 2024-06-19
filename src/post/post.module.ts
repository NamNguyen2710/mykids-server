import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Posts } from './entities/post.entity';
import { Hashtags } from './entities/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Hashtags])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
