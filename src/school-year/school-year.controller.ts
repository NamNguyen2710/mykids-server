import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';

import { SchoolYearService } from './school-year.service';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import { UserService } from 'src/users/users.service';

@Controller('school-year')
export class SchoolYearController {
  constructor(
    private readonly schoolYearService: SchoolYearService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createSchoolYearDto: CreateSchoolYearDto) {
    return this.schoolYearService.create(createSchoolYearDto);
  }

  @Get()
  async findAll(@Request() req): Promise<SchoolYears[]> {
    const user = await this.userService.findOne(req.user.id, [
      'assignedSchool',
    ]);

    return this.schoolYearService.findAll(user.assignedSchool.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolYearService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
  ) {
    return this.schoolYearService.update(+id, updateSchoolYearDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.schoolYearService.remove(+id);
  }
}
