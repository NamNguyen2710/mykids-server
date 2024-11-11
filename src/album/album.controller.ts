import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { AlbumService } from './album.service';
import { ValidationService } from 'src/users/validation.service';

import { CreateAlbumDto, CreateAlbumSchema } from './dto/create-album.dto';
import {
  ConfigedQueryAlbumDto,
  QueryAlbumDto,
  QueryAlbumSchema,
} from './dto/query-album.dto';
import {
  UpdateAlbumDto,
  UpdateAlbumSchema,
} from 'src/album/dto/update-album.dto';
import { ResponseAlbumSchema } from 'src/album/dto/response-album.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  CREATE_ALBUM_PERMISSION,
  CREATE_ASSIGNED_CLASS_ALBUM_PERMISSION,
  CREATE_SCHOOL_ALBUM_PERMISSION,
  DELETE_ALBUM_PERMISSION,
  DELETE_ASSIGNED_CLASS_ALBUM_PERMISSION,
  DELETE_SCHOOL_ALBUM_PERMISSION,
  READ_ALL_ALBUM_PERMISSION,
  READ_ASSIGNED_CLASS_ALBUM_PERMISSION,
  READ_SCHOOL_ALBUM_PERMISSION,
  UPDATE_ALBUM_PERMISSION,
  UPDATE_ASSIGNED_CLASS_ALBUM_PERMISSION,
  UPDATE_SCHOOL_ALBUM_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(CreateAlbumSchema))
    createAlbumDto: CreateAlbumDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: req.user.id,
        schoolId: req.user.faculty?.schoolId,
        classId: createAlbumDto.classId,
        allPermissionId: CREATE_ALBUM_PERMISSION,
        classPermissionId: CREATE_ASSIGNED_CLASS_ALBUM_PERMISSION,
        schoolPermissionId: CREATE_SCHOOL_ALBUM_PERMISSION,
      });
    if (!permission.allPermission) {
      if (createAlbumDto.classId) {
        if (!permission.classPermission)
          throw new ForbiddenException(
            'You do not have permission to create album in this class',
          );
      } else {
        if (!permission.schoolPermission)
          throw new ForbiddenException(
            'You do not have permission to create album in this school',
          );
      }
    }

    createAlbumDto.schoolId = req.user.faculty.schoolId;
    const res = await this.albumService.createAlbum(
      req.user.id,
      createAlbumDto,
    );
    return ResponseAlbumSchema.parse(res);
  }

  @Get()
  async findAll(
    @Request() req: RequestWithUser,
    @Query(new ZodValidationPipe(QueryAlbumSchema))
    query: QueryAlbumDto,
  ) {
    const configedQuery: ConfigedQueryAlbumDto = {
      page: query.page,
      limit: query.limit,
      isPublished: query.isPublished,
    };

    if (req.user.roleId === Role.PARENT) {
      const permission =
        await this.validationService.validateParentChildrenPermission(
          req.user.id,
          query.studentId,
        );

      if (!permission)
        throw new ForbiddenException(
          'You do not have permission to view albums for this student',
        );

      configedQuery.studentId = query.studentId;
      configedQuery.isPublished = true;
    } else {
      const permission =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: req.user.id,
          schoolId: req.user.faculty?.schoolId,
          classId: query.classId,
          allPermissionId: READ_ALL_ALBUM_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_ALBUM_PERMISSION,
          schoolPermissionId: READ_SCHOOL_ALBUM_PERMISSION,
        });

      if (
        !permission.allPermission &&
        !permission.classPermission &&
        !permission.schoolPermission
      ) {
        throw new ForbiddenException(
          'You do not have permission to view albums',
        );
      }

      if (permission.allPermission) {
        configedQuery.schoolId = req.user.faculty.schoolId;
        configedQuery.classId = query.classId;
      } else {
        if (permission.classPermission) {
          if (query.classId) configedQuery.classId = query.classId;
          else configedQuery.facultyId = req.user.id;
        }
        if (permission.schoolPermission) {
          configedQuery.schoolId = req.user.faculty.schoolId;
          if (!permission.classPermission) configedQuery.classId = null;
        }
      }
    }

    return this.albumService.findAll(configedQuery);
  }

  @Get(':albumId')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('albumId', ParseIntPipe) albumId: number,
  ) {
    if (req.user.roleId === Role.PARENT) {
      const permission = await this.albumService.validateAlbumParentPermission(
        albumId,
        req.user.id,
      );

      if (!permission)
        throw new ForbiddenException(
          'You do not have permission to view this album',
        );

      return ResponseAlbumSchema.parse(permission);
    } else {
      const album = await this.albumService.findOne(albumId);

      const permission =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: req.user.id,
          schoolId: album.schoolId,
          classId: album.classId,
          allPermissionId: READ_ALL_ALBUM_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_ALBUM_PERMISSION,
          schoolPermissionId: READ_SCHOOL_ALBUM_PERMISSION,
        });

      if (!permission.allPermission) {
        if (album.classId) {
          if (!permission.classPermission)
            throw new ForbiddenException(
              'You do not have permission to view this album',
            );
        } else {
          if (!permission.schoolPermission)
            throw new ForbiddenException(
              'You do not have permission to view this album',
            );
        }
      }

      return ResponseAlbumSchema.parse(album);
    }
  }

  @Put(':albumId')
  async update(
    @Request() req: RequestWithUser,
    @Param('albumId', ParseIntPipe) albumId: number,
    @Body(new ZodValidationPipe(UpdateAlbumSchema))
    updateAlbumDto: UpdateAlbumDto,
  ) {
    const album = await this.albumService.findOne(albumId);

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: req.user.id,
        schoolId: album.schoolId,
        classId: album.classId,
        allPermissionId: UPDATE_ALBUM_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_ALBUM_PERMISSION,
        schoolPermissionId: UPDATE_SCHOOL_ALBUM_PERMISSION,
      });

    if (!permission.allPermission) {
      if (album.classId) {
        if (!permission.classPermission)
          throw new ForbiddenException(
            'You do not have permission to update this album',
          );
      } else {
        if (!permission.schoolPermission)
          throw new ForbiddenException(
            'You do not have permission to update this album',
          );
      }
    }

    const res = await this.albumService.update(albumId, updateAlbumDto);
    return ResponseAlbumSchema.parse(res);
  }

  @Delete(':albumId')
  @HttpCode(204)
  async remove(
    @Request() req: RequestWithUser,
    @Param('albumId', ParseIntPipe) albumId: number,
  ) {
    const album = await this.albumService.findOne(albumId);

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: req.user.id,
        schoolId: album.schoolId,
        classId: album.classId,
        allPermissionId: DELETE_ALBUM_PERMISSION,
        classPermissionId: DELETE_ASSIGNED_CLASS_ALBUM_PERMISSION,
        schoolPermissionId: DELETE_SCHOOL_ALBUM_PERMISSION,
      });

    if (!permission.allPermission) {
      if (album.classId) {
        if (!permission.classPermission)
          throw new ForbiddenException(
            'You do not have permission to update this album',
          );
      } else {
        if (!permission.schoolPermission)
          throw new ForbiddenException(
            'You do not have permission to update this album',
          );
      }
    }

    return this.albumService.remove(albumId);
  }
}
