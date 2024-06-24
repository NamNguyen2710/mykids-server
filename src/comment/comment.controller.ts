import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LoginGuard } from 'src/guard/login.guard';

@UseGuards(LoginGuard)
@Controller('post/:postId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Request() request,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      request.user.sub,
      postId,
      createCommentDto,
    );
  }

  @Get('all')
  findAllOfPost(@Param('postId') postId: number) {
    return this.commentService.findAllCommentsOfPost(postId);
  }

  @Put(':commentId')
  update(
    @Param('commentId') commentId: number,
    @Request() request,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  remove(@Param('commentId') commentId: number, @Request() request) {
    return this.commentService.remove(commentId);
  }
}
