import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postService.create(createPostDto);
  // }

  @Get('all/school/:school_id')

  findAll(
    @Param('school_id') school_id: number
  ) {
    return this.postService.findSchoolPosts(school_id);
  }

  @Get(':post_id/school/:school_id')
  findOne(
    @Param('post_id') post_id: number, 
    @Param('school_id') school_id: number
  ) {
      return this.postService.findOneSchoolPost(school_id, post_id);
    }

  @Patch(':post_id/school/:school_id')
  update(
    @Param('post_id') post_id: number,
    @Param('school_id') school_id: number,
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postService.update(school_id, post_id, updatePostDto);
  }

  @Delete(':post_id/school/:school_id')
  remove(
    @Param('post_id') post_id: number,
    @Param('school_id') school_id: number
  ) {
    return this.postService.remove(school_id, post_id);
  }
}
