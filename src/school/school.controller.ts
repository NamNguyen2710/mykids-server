import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from 'src/school/dto/query-school.dto';
import { LoginGuard } from 'src/guard/login.guard';

@Controller('school')
@UseGuards(LoginGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  async findAll(@Query() query: QuerySchoolDto) {
    return this.schoolService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const schoolId = parseInt(id);
    if (isNaN(schoolId)) throw new BadRequestException('Invalid school id');

    return this.schoolService.findOne(schoolId);
  }

  @Put(':id/deactivate')
  async deactivateSchool(@Param('id') id: string) {
    const schoolId = parseInt(id);
    if (isNaN(schoolId)) throw new BadRequestException('Invalid school id');

    return this.schoolService.deactivateSchool(schoolId);
  }

  @Put(':id/activate')
  async activateSchool(@Param('id') id: string) {
    const schoolId = parseInt(id);
    if (isNaN(schoolId)) throw new BadRequestException('Invalid school id');

    return this.schoolService.activateSchool(schoolId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    const schoolId = parseInt(id);
    if (isNaN(schoolId)) throw new BadRequestException('Invalid school id');

    return this.schoolService.update(schoolId, updateSchoolDto);
  }
}
