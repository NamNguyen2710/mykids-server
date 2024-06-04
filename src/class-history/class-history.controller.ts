import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassHistoryService } from './class-history.service';
import { CreateClassHistoryDto } from './dto/create-class-history.dto';
import { UpdateClassHistoryDto } from './dto/update-class-history.dto';

@Controller('class-history')
export class ClassHistoryController {
  constructor(private readonly classHistoryService: ClassHistoryService) {}

  @Post()
  create(@Body() createClassHistoryDto: CreateClassHistoryDto) {
    return this.classHistoryService.create(createClassHistoryDto);
  }

  @Get()
  findAll() {
    return this.classHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassHistoryDto: UpdateClassHistoryDto) {
    return this.classHistoryService.update(+id, updateClassHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classHistoryService.remove(+id);
  }
}
