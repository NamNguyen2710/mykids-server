import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { SchoolService } from './school.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { CreateSchoolDto, CreateSchoolSchema } from './dto/create-school.dto';
import { UpdateSchoolDto, UpdateSchoolSchema } from './dto/update-school.dto';
import {
  QuerySchoolDto,
  QuerySchoolSchema,
} from 'src/school/dto/query-school.dto';

@Controller('school')
@UseGuards(LoginGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateSchoolSchema))
    createSchoolDto: CreateSchoolDto,
  ) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(QuerySchoolSchema))
    query: QuerySchoolDto,
  ) {
    return this.schoolService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schoolService.findOne(id);
  }

  @Put(':id/deactivate')
  async deactivateSchool(@Param('id', ParseIntPipe) id: number) {
    return this.schoolService.deactivateSchool(id);
  }

  @Put(':id/activate')
  async activateSchool(@Param('id', ParseIntPipe) id: number) {
    return this.schoolService.activateSchool(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateSchoolSchema))
    updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(id, updateSchoolDto);
  }
}
