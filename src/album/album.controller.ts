import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { LoginGuard } from 'src/guard/login.guard';
import { QueryAlbumDto } from './dto/query-album.dto';
import { AddAssetDTO } from './dto/add-asset.dto';

@UseGuards(LoginGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
    return this.albumService.createAlbum(req.user.sub, createAlbumDto);
  }

  @Post(':albumId/add/assets')
  addAsset(
    @Param(':albumId') albumId: number,
    @Body() addAssetDto: AddAssetDTO,
  ) {
    return this.albumService.addAssetsToAlbum(albumId, addAssetDto.assets);
  }

  @Get('school')
  findAll(@Request() req, @Query() queryAlbumDto: QueryAlbumDto) {
    return this.albumService.getAlbumsBySchool(req.user.sub, queryAlbumDto);
  }

  @Post(':albumId/remove/assets')
  removeAseet(
    @Param(':albumId') albumId: number,
    @Body() addAssetDto: AddAssetDTO,
  ) {
    return this.albumService.removeAssetsFromAlbum(albumId, addAssetDto.assets);
  }

  @Get(':albumId')
  findOne(@Request() req, @Param('albumId', ParseIntPipe) albumId: number) {
    return this.albumService.openOneAlbum(req.user.sub, albumId);
  }

  @Delete(':albumId')
  remove(@Param('albumId') albumId: number) {
    return this.albumService.removeAlbum(albumId);
  }
}
