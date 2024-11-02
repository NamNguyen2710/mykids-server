import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Query,
  Request,
  ForbiddenException,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ClassService } from './class.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

import { CreateClassDto, CreateClassSchema } from './dto/create-class.dto';
import { UpdateClassDto, UpdateClassSchema } from './dto/update-class.dto';
import {
  ConfigedQueryClassesDto,
  QueryClassesDto,
  QueryClassesSchema,
} from 'src/class/dto/query-classes.dto';
import {
  ResponseClassSchema,
  DefaultClassSchema,
} from 'src/class/dto/response-class.dto';
import { ValidationService } from 'src/users/validation.service';
import {
  CREATE_CLASS_PERMISSION,
  DELETE_ASSIGNED_CLASS_PERMISSION,
  DELETE_CLASS_PERMISSION,
  READ_ALL_CLASS_PERMISSION,
  READ_ASSIGNED_CLASS_PERMISSION,
  UPDATE_ASSIGNED_CLASS_PERMISSION,
  UPDATE_CLASS_PERMISSION,
} from 'src/role/entities/permission.data';

@Controller('class')
@UseGuards(LoginGuard)
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateClassSchema))
    createClassDto: CreateClassDto,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty?.schoolId,
          permissionId: CREATE_CLASS_PERMISSION,
        },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to create a class in this school',
      );

    return this.classService.create(
      request.user.faculty.schoolId,
      createClassDto,
    );
  }

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryClassesSchema)) query: QueryClassesDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        allPermissionId: READ_ALL_CLASS_PERMISSION,
        classPermissionId: READ_ASSIGNED_CLASS_PERMISSION,
      });

    const configedQuery: ConfigedQueryClassesDto = {
      ...query,
      schoolId: request.user.faculty?.schoolId,
    };

    if (!permission.allPermission) {
      if (permission.classPermission) configedQuery.facultyId = request.user.id;
      else
        throw new ForbiddenException(
          'You do not have permission to view classes in this school',
        );
    }

    const res = await this.classService.findAll(configedQuery);

    const classes = res.data.map((c) => DefaultClassSchema.parse(c));
    return { ...res, data: classes };
  }

  @Get(':id')
  async findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: id,
        allPermissionId: READ_ALL_CLASS_PERMISSION,
        classPermissionId: READ_ASSIGNED_CLASS_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to view this class',
      );

    const classroom = await this.classService.findOne(id);
    return ResponseClassSchema.parse(classroom);
  }

  @Put(':id')
  async update(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateClassSchema))
    updateClassDto: UpdateClassDto,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: id,
        allPermissionId: UPDATE_CLASS_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classService.update(id, updateClassDto);
  }

  @Put(':id/deactivate')
  async deactivate(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: id,
        allPermissionId: UPDATE_CLASS_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: id,
        allPermissionId: DELETE_CLASS_PERMISSION,
        classPermissionId: DELETE_ASSIGNED_CLASS_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classService.remove(id);
  }
}
