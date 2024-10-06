import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';

import { UserService } from '../users/users.service';
import { ValidationService } from '../users/validation.service';
import { StudentService } from 'src/student/student.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import * as Role from '../users/entity/roles.data';
import { ParentProfileSchema } from 'src/profile/dto/response-parent-profile.dto';
import { ResponseUserSchema } from 'src/users/dto/response-user.dto';

import {
  UpdateParentProfileDto,
  UpdateParentProfileSchema,
} from 'src/profile/dto/update-parent-profile.dto';
import {
  UpdateStudentDto,
  UpdateStudentSchema,
} from 'src/student/dto/update-student.dto';
import { ResponseStudentSchema } from 'src/student/dto/response-student.dto';

@Controller('profile')
@UseGuards(LoginGuard)
export class ProfileController {
  constructor(
    private readonly usersService: UserService,
    private readonly studentService: StudentService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async getUserProfile(@Request() req) {
    if (req.user.role === Role.Parent.name) {
      const user = await this.usersService.findParentProfile(req.user.sub);
      const parentProfile = ParentProfileSchema.parse(user);

      return parentProfile;
    } else {
      const user = await this.usersService.findOne(req.user.sub, [
        'assignedSchool',
      ]);
      const userProfile = ResponseUserSchema.parse(user);

      return userProfile;
    }
  }

  @Put()
  async update(
    @Request() request,
    @Body(new ZodValidationPipe(UpdateParentProfileSchema))
    user: UpdateParentProfileDto,
  ): Promise<any> {
    return this.usersService.update(request.user.sub, user);
  }

  @Put('children/:studentId')
  async updateChildrenProfile(
    @Request() request,
    @Param('studentId', ParseIntPipe)
    studentId: number,
    @Body(new ZodValidationPipe(UpdateStudentSchema))
    studentDto: UpdateStudentDto,
  ): Promise<any> {
    const permission =
      await this.validationService.validateParentChildrenPermission(
        request.user.sub,
        studentId,
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update this student',
      );

    const student = await this.studentService.update(studentId, studentDto);
    return ResponseStudentSchema.parse(student);
  }

  @Delete()
  @HttpCode(204)
  async delete(@Request() req): Promise<any> {
    await this.usersService.delete(req.user.sub);
    return { status: true, message: 'User deleted successfully' };
  }
}
