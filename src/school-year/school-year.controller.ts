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
import * as Role from 'src/users/entity/roles.data';

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
    const permission =
      await this.validationService.validateSchoolAdminPermission(
        request.user.sub,
        createSchoolYearDto.schoolId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    return this.schoolYearService.create(createSchoolYearDto);
  }

  @Get()
  async findAll(@Request() req) {
    const permission = await this.validationService.validateUserRole(
      req.user.sub,
      Role.SchoolAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to assess this resource.',
      );

    // const user = await this.userService.findOne(req.user.sub, [
    //   'assignedSchool',
    // ]);
    // return this.schoolYearService.findAll(user.assignedSchool.id);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const schoolYear = await this.schoolYearService.findOne(id);
    const permission =
      await this.validationService.validateSchoolAdminPermission(
        request.user.sub,
        schoolYear.schoolId,
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
      await this.validationService.validateSchoolAdminPermission(
        request.user.sub,
        schoolYear.schoolId,
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
      await this.validationService.validateSchoolAdminPermission(
        request.user.sub,
        schoolYear.schoolId,
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
      await this.validationService.validateSchoolAdminPermission(
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
