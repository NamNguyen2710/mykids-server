import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Request,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';

import { MedicalService } from './medical.service';
import { UserService } from 'src/users/users.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  CreateMedicalDto,
  CreateMedicalSchema,
} from './dto/create-medical.dto';
import {
  UpdateMedicalDto,
  UpdateMedicalSchema,
} from './dto/update-medical.dto';
import { QueryMedicalDTO, QueryMedicalSchema } from './dto/query-medical.dto';
import { ResponseMedicalSchema } from 'src/medical/dto/medical-response.dto';
import { StudentService } from 'src/student/student.service';

@Controller('medical')
export class MedicalController {
  constructor(
    private readonly medicalService: MedicalService,
    private readonly userService: UserService,
    private readonly studentService: StudentService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateMedicalSchema))
    createMedicalDto: CreateMedicalDto,
  ) {
    const permission =
      (await this.userService.validateParentChildrenPermission(
        req.user.sub,
        req.createMedicalDto.schoolId,
      )) &&
      (await this.userService.validateParentSchoolPermission(
        req.user.sub,
        req.createMedicalDto.studentId,
      ));
    if (!permission) throw new ForbiddenException('Permission denied');

    return this.medicalService.create(createMedicalDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query(new ZodValidationPipe(QueryMedicalSchema))
    query: QueryMedicalDTO,
  ) {
    const res = await this.medicalService.findAll(query);
    return {
      data: ResponseMedicalSchema.parse(res.data),
      pagination: res.pagination,
    };
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const medical = await this.medicalService.findOne(id);
    return ResponseMedicalSchema.parse(medical);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateMedicalSchema))
    updateMedicalDto: UpdateMedicalDto,
  ) {
    const permission =
      await this.medicalService.validateParentMedicalPermission(
        req.user.sub,
        id,
      );
    if (!permission) throw new ForbiddenException('Permission denied');

    const medical = await this.medicalService.update(
      id,
      updateMedicalDto.assetIds,
    );
    return ResponseMedicalSchema.parse(medical);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const permission =
      await this.medicalService.validateParentMedicalPermission(
        req.user.sub,
        id,
      );
    if (!permission) throw new ForbiddenException('Permission denied');

    const medical = await this.medicalService.remove(id);
    return ResponseMedicalSchema.parse(medical);
  }
}
