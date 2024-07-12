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
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { LoginGuard } from 'src/guard/login.guard';

@UseGuards(LoginGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
    return this.albumService.create(req.user.sub, createAlbumDto);
  }

  // @Get()
  // findAll() {
  //   return this.albumService.getAllAlbum();
  // }

  @Get(':albumId')
  findOne(@Request() req, @Param('albumId', ParseIntPipe) albumId: number) {
    return this.albumService.openOneAlbum(req.user.sub, albumId);
  }

  @Delete(':albumId')
  remove(@Param('albumId') albumId: number) {
    return this.albumService.removeAlbum(albumId);
  }
}
