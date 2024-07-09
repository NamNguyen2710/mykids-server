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
  ParseIntPipe,
  ForbiddenException,
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
  async create(
    @Request() request,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      request.user.sub,
      postId,
      createCommentDto,
    );
  }

  @Get('all')
  async findAllOfPost(@Param('postId') postId: number) {
    return this.commentService.findAllCommentsOfPost(postId);
  }

  @Put(':commentId')
  async update(
    @Request() request,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const permission = this.commentService.validateCommentOwnership(
      request.user.sub,
      commentId,
    );
    if (!permission)
      throw new ForbiddenException('You are not allowed to edit this comment');

    return this.commentService.update(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  async remove(
    @Request() request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const permission = this.commentService.validateCommentOwnership(
      request.user.sub,
      commentId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );

    return this.commentService.remove(commentId);
  }
}
