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
    return this.postService.findSchoolPosts(request.user.sub, {
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
  async publish(@Request() request, @Param('postId') postId: number) {
    return this.postService.publishedPost(request.user.sub, postId);
  }

  @Delete(':postId')
  async remove(@Request() request, @Param('postId') postId: number) {
    return this.postService.remove(request.user.sub, postId);
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
