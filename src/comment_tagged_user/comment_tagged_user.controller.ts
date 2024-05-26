import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentTaggedUserService } from './comment_tagged_user.service';
import { CreateCommentTaggedUserDto } from './dto/create-comment_tagged_user.dto';
import { UpdateCommentTaggedUserDto } from './dto/update-comment_tagged_user.dto';

@Controller('comment-tagged-user')
export class CommentTaggedUserController {
  constructor(private readonly commentTaggedUserService: CommentTaggedUserService) {}

  @Post()
  create(@Body() createCommentTaggedUserDto: CreateCommentTaggedUserDto) {
    return this.commentTaggedUserService.create(createCommentTaggedUserDto);
  }

  @Get()
  findAll() {
    return this.commentTaggedUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentTaggedUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentTaggedUserDto: UpdateCommentTaggedUserDto) {
    return this.commentTaggedUserService.update(+id, updateCommentTaggedUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentTaggedUserService.remove(+id);
  }
}
