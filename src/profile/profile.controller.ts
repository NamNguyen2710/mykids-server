import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Request,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';

import { UserService } from '../users/users.service';
import { LoginGuard } from 'src/guard/login.guard';

import * as Role from '../users/entity/roles.data';
import { ParentProfileSchema } from 'src/profile/dto/response-parent-profile.dto';
import { ResponseUserSchema } from 'src/users/dto/response-user.dto';
import { StudentService } from 'src/student/student.service';
import { UpdateParentProfileDto } from 'src/profile/dto/update-parent-profile.dto';
import { UpdateStudentDto } from 'src/student/dto/update-student.dto';

@Controller('profile')
@UseGuards(LoginGuard)
export class ProfileController {
  constructor(
    private readonly usersService: UserService,
    private readonly studentService: StudentService,
  ) {}

  @Get()
  async getUserProfile(@Request() req) {
    if (req.user.role.name === Role.Parent.name) {
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
    @Request() req,
    @Body() user: UpdateParentProfileDto,
  ): Promise<any> {
    return this.usersService.update(req.user.sub, user);
  }

  @Put('children/:studentId')
  async updateChildrenProfile(
    @Request() req,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() student: UpdateStudentDto,
  ): Promise<any> {
    return this.studentService.update(studentId, student);
  }

  @Delete()
  @HttpCode(204)
  async delete(@Param('userId') userId: number): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    await this.usersService.delete(userId);

    return { status: true, message: 'User deleted successfully' };
  }
}
