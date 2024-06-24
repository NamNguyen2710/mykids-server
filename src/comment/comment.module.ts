import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comments } from './entities/comment.entity';
import { CommentTaggedUser } from 'src/comment/entities/comment_tagged_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, CommentTaggedUser])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
