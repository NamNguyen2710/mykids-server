import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  ForbiddenException,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { SchoolYearService } from './school-year.service';
import { ValidationService } from 'src/users/validation.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

import {
  CreateSchoolYearDto,
  CreateSchoolYearSchema,
} from './dto/create-school-year.dto';
import {
  UpdateSchoolYearDto,
  UpdateSchoolYearSchema,
} from './dto/update-school-year.dto';
import {
  CREATE_SCHOOL_YEAR_PERMISSION,
  DELETE_SCHOOL_YEAR_PERMISSION,
  READ_ALL_SCHOOL_YEAR_PERMISSION,
  UPDATE_SCHOOL_YEAR_PERMISSION,
} from 'src/role/entities/permission.data';

@Controller('school-year')
@UseGuards(LoginGuard)
export class SchoolYearController {
  constructor(
    private readonly schoolYearService: SchoolYearService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateSchoolYearSchema))
    createSchoolYearDto: CreateSchoolYearDto,
  ) {
    createSchoolYearDto.schoolId = request.user.faculty?.schoolId;
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: createSchoolYearDto.schoolId,
          permissionId: CREATE_SCHOOL_YEAR_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.create(createSchoolYearDto);
  }

  @Get()
  async findAll(@Request() req) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        req.user.id,
        {
          schoolId: req.user.faculty.schoolId,
          permissionId: READ_ALL_SCHOOL_YEAR_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.findAll(req.user.faculty.schoolId);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: schoolYear.schoolId,
          permissionId: READ_ALL_SCHOOL_YEAR_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return schoolYear;
  }

  @Put(':id')
  async update(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateSchoolYearSchema))
    updateSchoolYearDto: UpdateSchoolYearDto,
  ) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: schoolYear.schoolId,
          permissionId: UPDATE_SCHOOL_YEAR_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.update(id, updateSchoolYearDto);
  }

  @Put(':id/deactivate')
  async deactivate(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: schoolYear.schoolId,
          permissionId: UPDATE_SCHOOL_YEAR_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: schoolYear.schoolId,
          permissionId: DELETE_SCHOOL_YEAR_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.remove(id);
  }
}
