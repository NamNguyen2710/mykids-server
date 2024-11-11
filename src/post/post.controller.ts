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
  ParseIntPipe,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';

import { PostService } from './post.service';
import { ValidationService } from 'src/users/validation.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  ConfigedQueryPostDto,
  QueryPostDto,
  QueryPostSchema,
} from 'src/post/dto/query-post.dto';
import { CreatePostDto, CreatePostSchema } from 'src/post/dto/create-post.dto';
import { UpdatePostDto, UpdatePostSchema } from 'src/post/dto/update-post.dto';
import { ResponsePostSchema } from 'src/post/dto/response-post.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  CREATE_ASSIGNED_CLASS_POST_PERMISSION,
  CREATE_POST_PERMISSION,
  CREATE_SCHOOL_POST_PERMISSION,
  DELETE_ASSIGNED_CLASS_POST_PERMISSION,
  DELETE_POST_PERMISSION,
  READ_ALL_POST_PERMISSION,
  READ_ASSIGNED_CLASS_POST_PERMISSION,
  READ_SCHOOL_POST_PERMISSION,
  UPDATE_ASSIGNED_CLASS_POST_PERMISSION,
  UPDATE_POST_PERMISSION,
  UPDATE_SCHOOL_POST_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('post')
@UseGuards(LoginGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly validationService: ValidationService,
  ) {}

  // Get all school post
  @Get('')
  async findAll(
    @Request() request: RequestWithUser,
    @Query(new ZodValidationPipe(QueryPostSchema))
    query: QueryPostDto,
  ) {
    const configedQuery: ConfigedQueryPostDto = {
      limit: query.limit,
      page: query.page,
    };

    if (request.user.roleId === Role.PARENT) {
      const permission =
        await this.validationService.validateParentChildrenPermission(
          request.user.id,
          query.studentId,
        );
      if (!permission)
        throw new ForbiddenException(
          'You are not allowed to access this resource',
        );

      configedQuery.studentId = query.studentId;
    } else {
      const permission =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: request.user.id,
          schoolId: request.user.faculty?.schoolId,
          classId: query.classId,
          allPermissionId: READ_ALL_POST_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_POST_PERMISSION,
          schoolPermissionId: READ_SCHOOL_POST_PERMISSION,
        });

      if (
        !permission.allPermission &&
        !permission.classPermission &&
        !permission.schoolPermission
      )
        throw new ForbiddenException(
          'You are not allowed to access this resource',
        );

      if (permission.allPermission) {
        configedQuery.schoolId = request.user.faculty.schoolId;
        configedQuery.classId = query.classId;
      } else {
        if (permission.classPermission) {
          if (query.classId) configedQuery.classId = query.classId;
          else configedQuery.facultyId = request.user.id;
        }
        if (permission.schoolPermission) {
          configedQuery.schoolId = request.user.faculty.schoolId;
          if (!permission.classPermission) configedQuery.classId = null;
        }
      }
    }

    const res = await this.postService.findSchoolPosts(
      request.user.id,
      configedQuery,
    );
    return {
      data: res.data.map((post) => ResponsePostSchema.parse(post)),
      pagination: res.pagination,
    };
  }

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(CreatePostSchema)) createPostDto: CreatePostDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: req.user.id,
        schoolId: req.user.faculty?.schoolId,
        classId: createPostDto.classId,
        allPermissionId: CREATE_POST_PERMISSION,
        classPermissionId: CREATE_ASSIGNED_CLASS_POST_PERMISSION,
        schoolPermissionId: CREATE_SCHOOL_POST_PERMISSION,
      });

    if (
      !permission.allPermission &&
      (!createPostDto.classId || !permission.classPermission) &&
      !permission.schoolPermission
    )
      throw new ForbiddenException(
        'You are not allowed to create post for this school',
      );

    createPostDto.schoolId = req.user.faculty.schoolId;
    return this.postService.create(req.user.id, createPostDto);
  }

  @Put(':postId')
  async publish(
    @Request() req: RequestWithUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Body(new ZodValidationPipe(UpdatePostSchema)) updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postService.findOne(postId);

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: req.user.id,
        schoolId: post.schoolId,
        classId: post.classId,
        allPermissionId: UPDATE_POST_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_POST_PERMISSION,
        schoolPermissionId: UPDATE_SCHOOL_POST_PERMISSION,
      });

    if (
      !permission.allPermission &&
      (!post.classId || !permission.classPermission) &&
      !permission.schoolPermission
    )
      throw new ForbiddenException('You are not allowed to update this post');

    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  async remove(
    @Request() req: RequestWithUser,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const post = await this.postService.findOne(postId);

    const permission =
      (await this.validationService.validateSchoolFacultyPermission(
        req.user.id,
        {
          schoolId: post.schoolId,
          permissionId: DELETE_POST_PERMISSION,
        },
      )) ||
      (await this.validationService.validateSchoolFacultyClassPermission(
        req.user.id,
        {
          classId: post.classId,
          permissionId: DELETE_ASSIGNED_CLASS_POST_PERMISSION,
        },
      ));

    if (!permission)
      throw new ForbiddenException('You are not allowed to delete this post');

    return this.postService.remove(postId);
  }

  @Post(':postId/like')
  async like(
    @Request() request: RequestWithUser,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.like(request.user.id, postId);
  }

  @Post(':postId/unlike')
  async unlike(
    @Request() request: RequestWithUser,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.unlike(request.user.id, postId);
  }
}
