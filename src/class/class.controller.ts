import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';

import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { QueryClassesSchema } from 'src/class/dto/query-classes.dto';
import { DefaultClassSchema } from 'src/class/dto/response-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  async findAll(@Query() query) {
    const classQuery = QueryClassesSchema.parse(query);
    const res = await this.classService.findAll(classQuery);

    const classes = res.data.map((c) => DefaultClassSchema.parse(c));
    return { ...res, data: classes };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classService.update(+id, updateClassDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}
