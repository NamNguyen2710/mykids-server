import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { Users } from 'src/users/entity/users.entity';
import { Posts } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comments, 
      Users, 
      Posts
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
