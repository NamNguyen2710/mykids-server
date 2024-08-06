import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { LoginGuard } from 'src/guard/login.guard';

@UseGuards(LoginGuard)
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@UploadedFile() file) {
    return this.imageService.create(file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }
}
