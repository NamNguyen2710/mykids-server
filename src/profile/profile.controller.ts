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

import { ParentProfileSchema } from 'src/profile/dto/response-parent-profile.dto';
// import {
//   UpdateParentProfileDto,
//   UpdateParentProfileSchema,
// } from 'src/profile/dto/update-parent-profile.dto';
import {
  UpdateStudentDto,
  UpdateStudentSchema,
} from 'src/student/dto/update-student.dto';
import { ResponseFacultySchema } from 'src/users/dto/response-faculty.dto';
import { ResponseStudentSchema } from 'src/student/dto/response-student.dto';
import { ResponseSuperAdminSchema } from 'src/users/dto/response-super-admin.dto';

import { Role } from '../role/entities/roles.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('profile')
@UseGuards(LoginGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async getUserProfile(@Request() req) {
    switch (req.user.roleId) {
      case Role.PARENT: {
        const user = await this.userService.findParentProfile(req.user.id);
        const parentProfile = ParentProfileSchema.parse(user);

        return parentProfile;
      }
      case Role.SUPER_ADMIN:
        return ResponseSuperAdminSchema.parse(req.user);

      default: {
        const user = await this.userService.findOne(req.user.id, [
          'faculty.assignedSchool',
        ]);
        return ResponseFacultySchema.parse(user);
      }
    }
  }

  // @Put()
  // async update(
  //   @Request() request: RequestWithUser,
  //   @Body(new ZodValidationPipe(UpdateParentProfileSchema))
  //   user: UpdateParentProfileDto,
  // ): Promise<any> {
  //   return this.userService.update(request.user.id, user);
  // }

  @Put('children/:studentId')
  async updateChildrenProfile(
    @Request() request: RequestWithUser,
    @Param('studentId', ParseIntPipe)
    studentId: number,
    @Body(new ZodValidationPipe(UpdateStudentSchema))
    studentDto: UpdateStudentDto,
  ): Promise<any> {
    const permission =
      await this.validationService.validateParentChildrenPermission(
        request.user.id,
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
    await this.userService.delete(req.user.id);
    return { status: true, message: 'User deleted successfully' };
  }
}
