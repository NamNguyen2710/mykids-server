import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';

import { SchoolYearService } from './school-year.service';
import { UserService } from 'src/users/users.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  CreateSchoolYearDto,
  CreateSchoolYearSchema,
} from './dto/create-school-year.dto';
import {
  UpdateSchoolYearDto,
  UpdateSchoolYearSchema,
} from './dto/update-school-year.dto';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import * as Role from 'src/users/entity/roles.data';

@Controller('school-year')
export class SchoolYearController {
  constructor(
    private readonly schoolYearService: SchoolYearService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateSchoolYearSchema))
    createSchoolYearDto: CreateSchoolYearDto,
  ) {
    const permission = await this.userService.validateUserRole(
      request.user.sub,
      Role.SchoolAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.create(createSchoolYearDto);
  }

  @Get()
  async findAll(@Request() req): Promise<SchoolYears[]> {
    const permission = await this.userService.validateUserRole(
      req.user.sub,
      Role.SchoolAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    const user = await this.userService.findOne(req.user.id, [
      'assignedSchool',
    ]);
    return this.schoolYearService.findAll(user.assignedSchool.id);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      schoolYear.schoolId,
    );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return schoolYear;
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateSchoolYearSchema))
    updateSchoolYearDto: UpdateSchoolYearDto,
  ) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      schoolYear.schoolId,
    );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.update(id, updateSchoolYearDto);
  }

  @Delete(':id')
  async remove(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      schoolYear.schoolId,
    );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.remove(id);
  }
}
