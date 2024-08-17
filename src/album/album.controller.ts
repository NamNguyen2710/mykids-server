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
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { AlbumService } from './album.service';
import { UserService } from 'src/users/users.service';

import { CreateAlbumDto, CreateAlbumSchema } from './dto/create-album.dto';
import { QueryAlbumDto, QueryAlbumSchema } from './dto/query-album.dto';
import {
  UpdateAlbumDto,
  UpdateAlbumSchema,
} from 'src/album/dto/update-album.dto';

@UseGuards(LoginGuard)
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateAlbumSchema))
    createAlbumDto: CreateAlbumDto,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      req.user.sub,
      createAlbumDto.schoolId,
    );
    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to create album in this school',
      );

    return this.albumService.createAlbum(req.user.sub, createAlbumDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query(new ZodValidationPipe(QueryAlbumSchema))
    query: QueryAlbumDto,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      req.user.sub,
      query.schoolId,
    );
    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to view albums in this school',
      );

    return this.albumService.findAll(query);
  }

  @Get(':albumId')
  async findOne(
    @Request() req,
    @Param('albumId', ParseIntPipe) albumId: number,
  ) {
    const permission =
      (await this.albumService.validateAlbumAdminPermission(
        albumId,
        req.user.sub,
      )) ||
      (await this.albumService.validateAlbumParentPermission(
        albumId,
        req.user.sub,
      ));

    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to view this album',
      );

    return this.albumService.findOne(req.user.sub, albumId);
  }

  @Put(':albumId')
  async update(
    @Request() req,
    @Param(':albumId', ParseIntPipe) albumId: number,
    @Body(new ZodValidationPipe(UpdateAlbumSchema))
    updateAlbumDto: UpdateAlbumDto,
  ) {
    const permission = await this.albumService.validateAlbumAdminPermission(
      albumId,
      req.user.sub,
    );
    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to view this album',
      );

    return this.albumService.update(albumId, updateAlbumDto);
  }

  @Delete(':albumId')
  @HttpCode(204)
  async remove(
    @Request() req,
    @Param('albumId', ParseIntPipe) albumId: number,
  ) {
    const permission = await this.albumService.validateAlbumAdminPermission(
      albumId,
      req.user.sub,
    );
    if (!permission)
      throw new UnauthorizedException(
        'You do not have permission to view this album',
      );
    return this.albumService.remove(albumId);
  }
}
