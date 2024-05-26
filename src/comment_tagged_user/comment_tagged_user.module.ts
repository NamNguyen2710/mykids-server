import { Module } from '@nestjs/common';
import { CommentTaggedUserService } from './comment_tagged_user.service';
import { CommentTaggedUserController } from './comment_tagged_user.controller';

@Module({
  controllers: [CommentTaggedUserController],
  providers: [CommentTaggedUserService],
})
export class CommentTaggedUserModule {}
