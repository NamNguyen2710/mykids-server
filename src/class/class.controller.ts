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
import { ClassHistoryService } from './class-history.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

import { CreateClassDto, CreateClassSchema } from './dto/create-class.dto';
import { UpdateClassDto, UpdateClassSchema } from './dto/update-class.dto';
import {
  QueryClassesDto,
  QueryClassesSchema,
} from 'src/class/dto/query-classes.dto';
import {
  ResponseClassSchema,
  DefaultClassSchema,
} from 'src/class/dto/response-class.dto';
import { UserService } from 'src/users/users.service';
import { UpdateClassHistoryDto } from 'src/class/dto/update-class-history.dto';

@Controller('class')
@UseGuards(LoginGuard)
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly classHistoryService: ClassHistoryService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Request() request,
    @Body(new ZodValidationPipe(CreateClassSchema))
    createClassDto: CreateClassDto,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      createClassDto.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to create a class in this school',
      );

    return this.classService.create(createClassDto);
  }

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryClassesSchema)) query: QueryClassesDto,
  ) {
    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      query.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to view classes in this school',
      );

    const res = await this.classService.findAll(query);

    const classes = res.data.map((c) => DefaultClassSchema.parse(c));
    return { ...res, data: classes };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
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
    const classroom = await this.classService.findOne(id);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      classroom.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Request() request, @Param('id', ParseIntPipe) id: number) {
    const classroom = await this.classService.findOne(id);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      classroom.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classService.remove(id);
  }

  @Post(':id/student')
  async addStudent(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body('studentId', ParseIntPipe) studentId: number,
  ) {
    const classroom = await this.classService.findOne(id);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      classroom.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classHistoryService.create(id, studentId);
  }

  @Put(':id/student/:studentId')
  async updateStudent(
    @Request() request,
    @Param('id', ParseIntPipe) classId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() updateDto: UpdateClassHistoryDto,
  ) {
    const classroom = await this.classService.findOne(classId);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      classroom.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classHistoryService.update(classId, studentId, updateDto);
  }

  @Delete(':id/student/:studentId')
  @HttpCode(204)
  async removeStudent(
    @Request() request,
    @Param('id', ParseIntPipe) classId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    const classroom = await this.classService.findOne(classId);

    const permission = await this.userService.validateSchoolAdminPermission(
      request.user.sub,
      classroom.schoolId,
    );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this class',
      );

    return this.classHistoryService.remove(classId, studentId);
  }
}
