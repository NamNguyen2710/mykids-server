import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Request,
  UseGuards,
  Query,
  ParseIntPipe,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { LoaService } from './loa.service';
import { ValidationService } from 'src/users/validation.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { CreateLoaDto, CreateLoaSchema } from './dto/create-loa.dto';
import { UpdateLoaDto, UpdateLoaSchema } from './dto/update-loa.dto';
import {
  ConfigedQueryLoaDto,
  QueryLoaDto,
  QueryLoaSchema,
} from './dto/query-loa.dto';
import { ResponseLoaSchema } from 'src/loa/dto/response-loa.dto';

import { LOA_STATUS } from './entities/loa.entity';
import { Role } from 'src/role/entities/roles.data';
import {
  READ_ASSIGNED_CLASS_LOA_PERMISSION,
  READ_LOA_PERMISSION,
  UPDATE_ASSIGNED_CLASS_LOA_PERMISSION,
  UPDATE_LOA_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('loa')
export class LoaController {
  constructor(
    private readonly loaService: LoaService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(CreateLoaSchema)) createLoaDto: CreateLoaDto,
  ) {
    const permission =
      await this.validationService.validateParentChildrenPermission(
        req.user.id,
        createLoaDto.studentId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const loa = await this.loaService.create(req.user.id, createLoaDto);
    return ResponseLoaSchema.parse(loa);
  }

  @Get()
  async findAll(
    @Request() request: RequestWithUser,
    @Query(new ZodValidationPipe(QueryLoaSchema))
    query: QueryLoaDto,
  ): Promise<any> {
    let configedQuery: ConfigedQueryLoaDto = {
      limit: query.limit || 10,
      page: query.page || 1,
    };

    if (request.user.roleId === Role.PARENT) {
      if (!query.studentId)
        throw new BadRequestException('Student id is required');
      if (!query.classId) throw new BadRequestException('Class id is required');

      const permission =
        await this.validationService.validateParentChildrenPermission(
          request.user.id,
          query.studentId,
        );
      if (!permission)
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );

      configedQuery.studentId = query.studentId;
    } else {
      const res =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: request.user.id,
          schoolId: request.user.faculty.schoolId,
          classId: query.classId,
          allPermissionId: READ_LOA_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_LOA_PERMISSION,
        });

      if (res.allPermission) {
        configedQuery = {
          ...configedQuery,
          ...query,
          schoolId: request.user.faculty.schoolId,
        };
      } else if (res.classPermission) {
        if (!query.classId) configedQuery.facultyId = request.user.id;
        else configedQuery.classId = query.classId;

        if (query.studentId) configedQuery.studentId = query.studentId;
      } else {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
    }

    const res = await this.loaService.findAll(configedQuery);

    return {
      data: res.data.map((datum) => ResponseLoaSchema.parse(datum)),
      pagination: res.pagination,
    };
  }

  @Get(':loaID')
  async findOne(
    @Request() request: RequestWithUser,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const loa = await this.loaService.findOne(loaID);
    if (!loa) throw new BadRequestException('Cannot find LOA notice!');

    let permission;

    if (request.user.roleId === Role.PARENT) {
      permission =
        await this.validationService.validateParentChildrenPermission(
          request.user.id,
          loa.studentId,
        );
    } else {
      const res =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: request.user.id,
          schoolId: loa.student.schoolId,
          classId: loa.classId,
          allPermissionId: READ_LOA_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_LOA_PERMISSION,
        });
      permission = res.allPermission || res.classPermission;
    }

    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return ResponseLoaSchema.parse(loa);
  }

  @Put(':loaID/approve')
  async approve(
    @Request() request: RequestWithUser,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const loa = await this.loaService.findOne(loaID);
    if (!loa) throw new BadRequestException('Cannot find LOA notice');

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: loa.student.schoolId,
        classId: loa.classId,
        allPermissionId: UPDATE_LOA_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_LOA_PERMISSION,
      });
    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const res = await this.loaService.update(loaID, {
      reviewStatus: LOA_STATUS.APPROVE,
      reviewer: request.user,
    });
    return ResponseLoaSchema.parse(res);
  }

  @Put(':loaID/reject')
  async reject(
    @Request() request: RequestWithUser,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const loa = await this.loaService.findOne(loaID);
    if (!loa) throw new BadRequestException('Cannot find LOA notice');

    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: loa.student.schoolId,
        classId: loa.classId,
        allPermissionId: UPDATE_LOA_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_LOA_PERMISSION,
      });
    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const res = await this.loaService.update(loaID, {
      reviewStatus: LOA_STATUS.REJECT,
      reviewer: request.user,
    });
    return ResponseLoaSchema.parse(res);
  }

  @Put(':loaID/cancel')
  async cancel(
    @Request() request: RequestWithUser,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const loa = await this.loaService.findOne(loaID);
    if (!loa) throw new BadRequestException('Cannot find LOA notice');

    const permission =
      await this.validationService.validateParentChildrenPermission(
        request.user.id,
        loa.studentId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const res = await this.loaService.update(loaID, {
      reviewStatus: LOA_STATUS.CANCEL,
    });
    return ResponseLoaSchema.parse(res);
  }

  @Put(':loaID')
  async update(
    @Request() request: RequestWithUser,
    @Param('loaID', ParseIntPipe) loaID: number,
    @Body(new ZodValidationPipe(UpdateLoaSchema))
    updateLoaDto: UpdateLoaDto,
  ) {
    const loa = await this.loaService.findOne(loaID);
    if (!loa) throw new BadRequestException('Cannot find LOA notice');

    const permission =
      await this.validationService.validateParentChildrenPermission(
        request.user.id,
        loa.studentId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    const res = await this.loaService.update(loaID, updateLoaDto);
    return ResponseLoaSchema.parse(res);
  }
}
