import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { LoginGuard } from 'src/guard/login.guard';
import { QueryPostSchema } from 'src/post/dto/query-post.dto';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';

@Controller('post')
@UseGuards(LoginGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Get all school post
  @Get('all')
  async findAll(@Request() request, @Query() query) {
    const postQuery = QueryPostSchema.parse(query);
    return this.postService.findSchoolPosts(request.user.sub, postQuery);
  }

  @Post()
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user.sub, createPostDto);
  }

  @Put(':postId')
  async publish(
    @Request() req,
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const validate = await this.postService.validatePostPermission(
      req.user.sub,
      postId,
    );
    if (!validate)
      throw new UnauthorizedException(
        'You are not allowed to update this post',
      );

    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  async remove(@Request() req, @Param('postId') postId: number) {
    const validate = await this.postService.validatePostPermission(
      req.user.sub,
      postId,
    );
    if (!validate)
      throw new UnauthorizedException(
        'You are not allowed to delete this post',
      );

    return this.postService.remove(postId);
  }

  @Post(':postId/like')
  async like(@Request() request, @Param('postId') postId: number) {
    return this.postService.like(request.user.sub, postId);
  }

  @Post(':postId/unlike')
  async unlike(@Request() request, @Param('postId') postId: number) {
    return this.postService.unlike(request.user.sub, postId);
  }
}
