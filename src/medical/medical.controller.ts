import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  HttpCode,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';

import { MedicalService } from './medical.service';
import { ValidationService } from 'src/users/validation.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { LoginGuard } from 'src/guard/login.guard';

import {
  CreateMedicalDto,
  CreateMedicalSchema,
} from './dto/create-medical.dto';
import {
  UpdateMedicalDto,
  UpdateMedicalSchema,
} from './dto/update-medical.dto';
// import { QueryMedicalDTO, QueryMedicalSchema } from './dto/query-medical.dto';
import { ResponseMedicalSchema } from 'src/medical/dto/medical-response.dto';
import * as Role from 'src/users/entity/roles.data';
import { Users } from 'src/users/entity/users.entity';

@Controller('medical')
@UseGuards(LoginGuard)
export class MedicalController {
  constructor(
    private readonly medicalService: MedicalService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(CreateMedicalSchema))
    createMedicalDto: CreateMedicalDto,
  ) {
    const studentPermission =
      await this.validationService.validateParentChildrenPermission(
        req.user.sub,
        studentId,
      );
    if (!studentPermission)
      throw new ForbiddenException(
        'You do not have permission to create a medical record for this student',
      );

    return this.medicalService.create(createMedicalDto);
  }

  // @Get()
  // async findAll(
  //   @Request() req,
  //   @Query(new ZodValidationPipe(QueryMedicalSchema))
  //   query: QueryMedicalDTO,
  // ) {
  //   if (req.user.role === Role.Parent.name) {
  //     if (!query.studentId)
  //       throw new BadRequestException('Student id is required');

  //     const permission =
  //       await this.validationService.validateParentChildrenPermission(
  //         req.user.sub,
  //         query.studentId,
  //       );
  //     if (!permission) throw new ForbiddenException('Permission denied');
  //   } else if (req.user.role === Role.SchoolAdmin.name) {
  //     if (!query.schoolId)
  //       throw new BadRequestException('School id is required');

  //     const permission = await this.validationService.validateSchoolAdminPermission(
  //       req.user.sub,
  //       query.schoolId,
  //     );
  //     if (!permission) throw new ForbiddenException('Permission denied');
  //   } else {
  //     throw new ForbiddenException(
  //       'You do not have permission to access this resource',
  //     );
  //   }

  //   const res = await this.medicalService.findAll(query);
  //   return {
  //     data: res.data.map((med) => ResponseMedicalSchema.parse(med)),
  //     pagination: res.pagination,
  //   };
  // }

  @Get()
  async findOne(
    @Request() req,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    let permission: Users | null = null;
    if (req.user.role === Role.Parent.name)
      permission =
        await this.validationService.validateParentChildrenPermission(
          req.user.sub,
          studentId,
        );
    if (req.user.role === Role.SchoolAdmin.name) {
      permission =
        await this.validationService.validateSchoolAdminStudentPermission(
          req.user.sub,
          studentId,
        );
    }

    if (!permission)
      throw new ForbiddenException(
        'You dont have permission to view this student resource',
      );

    const medical = await this.medicalService.findOneByStudent(studentId);
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

    const medical = await this.medicalService.update(id, updateMedicalDto);
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
