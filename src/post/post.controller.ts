import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { LoginGuard } from 'src/guard/login.guard';

@Controller('post')
@UseGuards(LoginGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Get all school post
  @Get('all')
  async findAll(@Request() request, @Query() query): Promise<any> {
    return this.postService.findSchoolPosts(request.user, {
      schoolId: query.schoolId ? parseInt(query.schoolId) : null,
      limit: query.limit ? parseInt(query.limit) : 20,
      page: query.page ? parseInt(query.page) : 1,
    });
  }

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postService.create(createPostDto);
  // }

  @Post(':postId/publish')
  async publish(
    @Request() request,
    @Param('postId') postId: number,
  ): Promise<any> {
    return this.postService.publishedPost(request, postId);
  }

  @Delete(':postId')
  async remove(
    @Request() request,
    @Param('postId') postId: number,
  ): Promise<any> {
    return this.postService.remove(request.user, postId);
  }

  @Post(':postId/like')
  async like(
    @Request() request,
    @Param('postId') postId: number,
  ): Promise<any> {
    return this.postService.like(request, postId);
  }
}
