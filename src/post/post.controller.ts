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
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { PostService } from './post.service';
import { LoginGuard } from 'src/guard/login.guard';
import { QueryPostDto, QueryPostSchema } from 'src/post/dto/query-post.dto';
import { CreatePostDto, CreatePostSchema } from 'src/post/dto/create-post.dto';
import { UpdatePostDto, UpdatePostSchema } from 'src/post/dto/update-post.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { UserService } from 'src/users/users.service';

@Controller('post')
@UseGuards(LoginGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  // Get all school post
  @Get('all')
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryPostSchema)) query: QueryPostDto,
  ) {
    return this.postService.findSchoolPosts(request.user.sub, query);
  }

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreatePostSchema)) createPostDto: CreatePostDto,
  ) {
    const permission = this.userService.validateSchoolAdminPermission(
      req.user.sub,
      createPostDto.schoolId,
    );
    if (!permission)
      throw new UnauthorizedException(
        'You are not allowed to create post for this school',
      );

    return this.postService.create(req.user.sub, createPostDto);
  }

  @Put(':postId')
  async publish(
    @Request() req,
    @Param('postId', ParseIntPipe) postId: number,
    @Body(new ZodValidationPipe(UpdatePostSchema)) updatePostDto: UpdatePostDto,
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
  @HttpCode(204)
  async remove(@Request() req, @Param('postId', ParseIntPipe) postId: number) {
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
  async like(
    @Request() request,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.like(request.user.sub, postId);
  }

  @Post(':postId/unlike')
  async unlike(
    @Request() request,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.unlike(request.user.sub, postId);
  }
}
