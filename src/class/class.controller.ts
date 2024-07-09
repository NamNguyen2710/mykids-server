import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  Request,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';

import { ClassService } from './class.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { CreateClassDto, CreateClassSchema } from './dto/create-class.dto';
import { UpdateClassDto, UpdateClassSchema } from './dto/update-class.dto';
import {
  QueryClassesDto,
  QueryClassesSchema,
} from 'src/class/dto/query-classes.dto';
import { DefaultClassSchema } from 'src/class/dto/response-class.dto';
import { UserService } from 'src/users/users.service';

@Controller('class')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
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
    return this.classService.findOne(id);
  }

  @Patch(':id')
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
}
