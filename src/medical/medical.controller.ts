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
import { ResponseMedicalSchema } from 'src/medical/dto/medical-response.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  READ_ASSIGNED_CLASS_MEDICAL_PERMISSION,
  READ_MEDICAL_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('student/:studentId/medical')
@UseGuards(LoginGuard)
export class MedicalController {
  constructor(
    private readonly medicalService: MedicalService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body(new ZodValidationPipe(CreateMedicalSchema))
    createMedicalDto: CreateMedicalDto,
  ) {
    const studentPermission =
      await this.validationService.validateParentChildrenPermission(
        req.user.id,
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
  //   @Request() req: RequestWithUser,
  //   @Query(new ZodValidationPipe(QueryMedicalSchema))
  //   query: QueryMedicalDTO,
  // ) {
  //   if (req.user.role === Role.Parent.name) {
  //     if (!query.studentId)
  //       throw new BadRequestException('Student id is required');

  //     const permission =
  //       await this.validationService.validateParentChildrenPermission(
  //         req.user.id,
  //         query.studentId,
  //       );
  //     if (!permission) throw new ForbiddenException('Permission denied');
  //   } else if (req.user.role === Role.SchoolAdmin.name) {
  //     if (!query.schoolId)
  //       throw new BadRequestException('School id is required');

  //     const permission = await this.validationService.validateSchoolAdminPermission(
  //       req.user.id,
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
    @Request() req: RequestWithUser,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    let permission = null;
    if (req.user.roleId === Role.PARENT) {
      permission =
        await this.validationService.validateParentChildrenPermission(
          req.user.id,
          studentId,
        );
    } else {
      permission =
        (await this.validationService.validateSchoolFacultyPermission(
          req.user.id,
          { studentId, permissionId: READ_MEDICAL_PERMISSION },
        )) ||
        (await this.validationService.validateSchoolFacultyClassPermission(
          req.user.id,
          { studentId, permissionId: READ_ASSIGNED_CLASS_MEDICAL_PERMISSION },
        ));
    }

    if (!permission)
      throw new ForbiddenException(
        'You dont have permission to view this student resource',
      );

    const medical = await this.medicalService.findOneByStudent(studentId);
    return medical
      ? ResponseMedicalSchema.parse(medical)
      : { message: 'No medical record found' };
  }

  @Put(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateMedicalSchema))
    updateMedicalDto: UpdateMedicalDto,
  ) {
    const permission =
      await this.medicalService.validateParentMedicalPermission(
        req.user.id,
        id,
      );
    if (!permission) throw new ForbiddenException('Permission denied');

    const medical = await this.medicalService.update(id, updateMedicalDto);
    return ResponseMedicalSchema.parse(medical);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const permission =
      await this.medicalService.validateParentMedicalPermission(
        req.user.id,
        id,
      );
    if (!permission) throw new ForbiddenException('Permission denied');

    const medical = await this.medicalService.remove(id);
    return ResponseMedicalSchema.parse(medical);
  }
}
