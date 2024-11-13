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
  HttpCode,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { LoginGuard } from 'src/guard/login.guard';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ResponseCommentSchema } from 'src/comment/dto/response-comment.dto';

import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('post/:postId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Request() request: RequestWithUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.create(
      request.user.id,
      postId,
      createCommentDto,
    );
    return ResponseCommentSchema.parse(comment);
  }

  @Get('all')
  async findAllOfPost(@Param('postId') postId: number) {
    const res = await this.commentService.findAllCommentsOfPost(postId);
    return {
      data: res.data.map((comment) => ResponseCommentSchema.parse(comment)),
      pagination: res.pagination,
    };
  }

  @Put(':commentId')
  async update(
    @Request() request: RequestWithUser,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const permission = this.commentService.validateCommentOwnership(
      request.user.id,
      commentId,
    );
    if (!permission)
      throw new ForbiddenException('You are not allowed to edit this comment');

    const comment = await this.commentService.update(
      commentId,
      updateCommentDto,
    );
    return ResponseCommentSchema.parse(comment);
  }

  @Delete(':commentId')
  @HttpCode(204)
  async remove(
    @Request() request: RequestWithUser,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const permission = this.commentService.validateCommentOwnership(
      request.user.id,
      commentId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );

    return this.commentService.remove(commentId);
  }
}
