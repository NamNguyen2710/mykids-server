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
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { AlbumService } from './album.service';
import { UserService } from 'src/users/users.service';

import { CreateAlbumDto } from './dto/create-album.dto';
import { QueryAlbumDto } from './dto/query-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';

@UseGuards(LoginGuard)
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
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
  async findAll(@Request() req, @Query() query: QueryAlbumDto) {
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
    @Param(':albumId') albumId: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
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
