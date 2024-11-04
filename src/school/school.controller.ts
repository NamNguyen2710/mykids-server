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
  Request,
  ForbiddenException,
} from '@nestjs/common';

import { SchoolService } from './school.service';
import { ValidationService } from 'src/users/validation.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { CreateSchoolDto, CreateSchoolSchema } from './dto/create-school.dto';
import { UpdateSchoolDto, UpdateSchoolSchema } from './dto/update-school.dto';
import {
  QuerySchoolDto,
  QuerySchoolSchema,
} from 'src/school/dto/query-school.dto';

import { Role } from 'src/role/entities/roles.data';
import { UPDATE_SCHOOL_PERMISSION } from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('school')
@UseGuards(LoginGuard)
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() request: RequestWithUser,
    @Body(new ZodValidationPipe(CreateSchoolSchema))
    createSchoolDto: CreateSchoolDto,
  ) {
    if (request.user.roleId !== Role.SUPER_ADMIN)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  async findAll(
    @Request() request: RequestWithUser,
    @Query(new ZodValidationPipe(QuerySchoolSchema))
    query: QuerySchoolDto,
  ) {
    if (request.user.roleId !== Role.SUPER_ADMIN)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      request.user.faculty?.schoolId === id;
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.findOne(id);
  }

  @Put(':id/deactivate')
  async deactivateSchool(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (request.user.roleId !== Role.SUPER_ADMIN)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    // TODO: Implement deactivateSchool to deactivate all login
    return this.schoolService.deactivateSchool(id);
  }

  @Put(':id/activate')
  async activateSchool(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (request.user.roleId !== Role.SUPER_ADMIN)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.activateSchool(id);
  }

  @Put(':id')
  async update(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateSchoolSchema))
    updateSchoolDto: UpdateSchoolDto,
  ) {
    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { schoolId: id, permissionId: UPDATE_SCHOOL_PERMISSION },
      ));

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.update(id, updateSchoolDto);
  }
}
