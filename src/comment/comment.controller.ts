import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('user/:user_id/post/:post_id')
  create(
    @Param('user_id') user_id: number,
    @Param('post_id') post_id: number,
    @Body() createCommentDto: CreateCommentDto
  ) {
  
    return this.commentService.create(user_id, post_id, createCommentDto);
  
  }

  @Get('post/:post_id')
  findAllOfPost(
    @Param('post_id') post_id: number
  ) {
    return this.commentService.findAllCommentsOfPost(post_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Put(':comment_id/post/:post_id')
  update(
    @Param('comment_id') comment_id: number,
    @Param('post_id') post_id: number, 
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    return this.commentService.update(post_id, comment_id, updateCommentDto);
  }

  @Delete(':comment_id/user/:user_id')
  remove(
    @Param('comment_id') comment_id: number,
    @Param('user_id') user_id: number
  ) {
    return this.commentService.remove(user_id, comment_id);
  }
}
