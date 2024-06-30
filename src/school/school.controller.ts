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
import { UserService } from 'src/users/users.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import * as Role from 'src/users/entity/roles.data';
import { CreateSchoolDto, CreateSchoolSchema } from './dto/create-school.dto';
import { UpdateSchoolDto, UpdateSchoolSchema } from './dto/update-school.dto';
import {
  QuerySchoolDto,
  QuerySchoolSchema,
} from 'src/school/dto/query-school.dto';

@Controller('school')
@UseGuards(LoginGuard)
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateSchoolSchema))
    createSchoolDto: CreateSchoolDto,
  ) {
    const permission = await this.userService.validateUserRole(
      request.user.sub,
      Role.SuperAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QuerySchoolSchema))
    query: QuerySchoolDto,
  ) {
    const permission = await this.userService.validateUserRole(
      request.user.sub,
      Role.SuperAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.findAll(query);
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const permission =
      (await this.userService.validateUserRole(
        request.user.sub,
        Role.SuperAdmin.id,
      )) ||
      (await this.userService.validateSchoolAdminPermission(
        request.user.sub,
        id,
      ));
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.findOne(id);
  }

  @Put(':id/deactivate')
  async deactivateSchool(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const permission = await this.userService.validateUserRole(
      request.user.sub,
      Role.SuperAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.deactivateSchool(id);
  }

  @Put(':id/activate')
  async activateSchool(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const permission = await this.userService.validateUserRole(
      request.user.sub,
      Role.SuperAdmin.id,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.activateSchool(id);
  }

  @Put(':id')
  async update(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateSchoolSchema))
    updateSchoolDto: UpdateSchoolDto,
  ) {
    const permission =
      (await this.userService.validateUserRole(
        request.user.sub,
        Role.SuperAdmin.id,
      )) ||
      (await this.userService.validateSchoolAdminPermission(
        request.user.sub,
        id,
      ));
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.schoolService.update(id, updateSchoolDto);
  }
}
