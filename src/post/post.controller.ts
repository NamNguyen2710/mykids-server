import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postService.create(createPostDto);
  // }

  // Like and Unlike post
  @Post(':postId/like')
  async like(
    @Request() request,
    @Param('postId') postId: number,
  ): Promise<any> {
    return this.postService.like(request, postId);
  }

  @Post(':postId/publish-post')
  async publish(
    @Request() request,
    @Param('postId') postId: number,
  ): Promise<any> {
    return this.postService.publishedPost(request, postId);
  }

  // Get all school post
  @Get('all')
  async findAll(@Request() request): Promise<any> {
    return this.postService.findSchoolPosts(request.user);
  }

  @Delete(':post_id/school/:school_id')
  async remove(
    @Param('post_id') post_id: number,
    @Param('school_id') school_id: number,
  ): Promise<any> {
    return this.postService.remove(school_id, post_id);
  }

  @Get(':post_id/like')
  async getlike(@Param('post_id') post_id: number): Promise<any> {
    return this.postService.getLike(post_id);
  }
}
