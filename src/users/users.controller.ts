import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
  ParseIntPipe,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from './users.service';
import { ValidationService } from 'src/users/validation.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { QueryUserDto, QueryUserSchema } from './dto/query-user.dto';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from 'src/users/dto/update-user.dto';
import { ResponseParentSchema } from 'src/users/dto/response-parent.dto';
import { ResponseFacultySchema } from 'src/users/dto/response-faculty.dto';
import { ResponseSuperAdminSchema } from 'src/users/dto/response-super-admin.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  READ_ALL_SCHOOL_FACULTY_PERMISSION,
  READ_ALL_PARENT_PERMISSION,
  CREATE_SCHOOL_FACULTY_PERMISSION,
  UPDATE_SCHOOL_FACULTY_PERMISSION,
  DELETE_SCHOOL_FACULTY_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('user')
@UseGuards(LoginGuard)
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async findAll(
    @Request() request: RequestWithUser,
    @Query(new ZodValidationPipe(QueryUserSchema)) query: QueryUserDto,
  ) {
    if (request.user.roleId === Role.PARENT)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    let res, data;
    if (request.user.roleId === Role.SUPER_ADMIN) {
      res = await this.userService.findAll(query, ['faculty.assignedSchool']);
    } else if (request.user.faculty) {
      let permission;

      switch (query.roleId) {
        case Role.SUPER_ADMIN:
          throw new BadRequestException('Invalid role id');
        case Role.PARENT:
          permission =
            await this.validationService.validateSchoolFacultyPermission(
              request.user.id,
              {
                schoolId: request.user.faculty.schoolId,
                permissionId: READ_ALL_PARENT_PERMISSION,
              },
            );
          break;
        default:
          permission =
            await this.validationService.validateSchoolFacultyPermission(
              request.user.id,
              {
                schoolId: request.user.faculty.schoolId,
                permissionId: READ_ALL_SCHOOL_FACULTY_PERMISSION,
              },
            );
          break;
      }
      if (!permission)
        throw new ForbiddenException(
          'You are not allowed to access this resource',
        );

      query.schoolId = request.user.faculty.schoolId;
      res = await this.userService.findAll(query, []);
    } else
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    switch (query.roleId) {
      case Role.SUPER_ADMIN:
        data = res.data.map((user) => ResponseSuperAdminSchema.parse(user));
        break;
      case Role.PARENT:
        data = res.data.map((user) => ResponseParentSchema.parse(user));
        break;
      default:
        data = res.data.map((user) => ResponseFacultySchema.parse(user));
        break;
    }
    return { data, pagination: res.pagination };
  }

  @Get(':userId')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    if (req.user.roleId === Role.PARENT)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    const user = await this.userService.findOne(userId, [
      'faculty',
      'parent.schools',
    ]);
    if (!user) throw new NotFoundException('User does not exist!');

    if (req.user.roleId === Role.SUPER_ADMIN) {
      switch (user.roleId) {
        case Role.SUPER_ADMIN:
          return ResponseSuperAdminSchema.parse(user);
        case Role.PARENT:
          return ResponseParentSchema.parse(user);
        default:
          return ResponseFacultySchema.parse(user);
      }
    } else {
      if (user.roleId === Role.PARENT) {
        const permission =
          user.parent.schools.some(
            (school) => school.id === req.user.faculty?.schoolId,
          ) &&
          (await this.validationService.validateSchoolFacultyPermission(
            req.user.id,
            {
              schoolId: req.user.faculty?.schoolId,
              permissionId: READ_ALL_PARENT_PERMISSION,
            },
          ));

        if (!permission)
          throw new ForbiddenException(
            'You are not allowed to access this resource',
          );

        return ResponseParentSchema.parse(user);
      } else {
        const permission =
          user.faculty?.schoolId === req.user.faculty?.schoolId &&
          (await this.validationService.validateSchoolFacultyPermission(
            req.user.id,
            {
              schoolId: req.user.faculty?.schoolId,
              permissionId: READ_ALL_SCHOOL_FACULTY_PERMISSION,
            },
          ));

        if (!permission)
          throw new ForbiddenException(
            'You are not allowed to access this resource',
          );

        return ResponseFacultySchema.parse(user);
      }
    }
  }

  // Create super admin or school faculty, not parent
  @Post()
  async create(
    @Request() request: RequestWithUser,
    @Body(new ZodValidationPipe(CreateUserSchema))
    createUserDto: CreateUserDto,
  ) {
    if (createUserDto.roleId === Role.PARENT)
      throw new BadRequestException('Invalid role id');

    let permission: any = true;

    if (request.user.roleId !== Role.SUPER_ADMIN) {
      if (createUserDto.roleId === Role.SUPER_ADMIN) {
        throw new BadRequestException('Invalid role id');
      }

      permission = await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: createUserDto.schoolId,
          permissionId: CREATE_SCHOOL_FACULTY_PERMISSION,
        },
      );
    }

    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    const user = await this.userService.create(createUserDto);
    return user.roleId === Role.SUPER_ADMIN
      ? ResponseSuperAdminSchema.parse(user)
      : ResponseFacultySchema.parse(user);
  }

  // Update super admin or school faculty, not parent
  @Put(':userId')
  async update(
    @Request() request: RequestWithUser,
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ZodValidationPipe(UpdateUserSchema)) userDto: UpdateUserDto,
  ) {
    let permission: any = true;

    if (request.user.roleId !== Role.SUPER_ADMIN)
      permission = await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          facultyId: userId,
          permissionId: UPDATE_SCHOOL_FACULTY_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    const user = await this.userService.update(userId, userDto);
    return user.roleId === Role.SUPER_ADMIN
      ? ResponseSuperAdminSchema.parse(user)
      : ResponseFacultySchema.parse(user);
  }

  @Put(':userId/deactivate')
  async deactivate(
    @Request() request: RequestWithUser,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    let permission: any = true;

    if (request.user.roleId !== Role.SUPER_ADMIN)
      permission = await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          facultyId: userId,
          permissionId: UPDATE_SCHOOL_FACULTY_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    return this.userService.deactivate(userId);
  }

  @Put(':userId/activate')
  async activate(
    @Request() request: RequestWithUser,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    let permission: any = true;

    if (request.user.roleId !== Role.SUPER_ADMIN)
      permission = await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          facultyId: userId,
          permissionId: UPDATE_SCHOOL_FACULTY_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    return this.userService.update(userId, { isActive: true });
  }

  @Delete(':userId')
  @HttpCode(204)
  async delete(
    @Request() request: RequestWithUser,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    let permission: any = true;

    if (request.user.roleId !== Role.SUPER_ADMIN)
      permission = await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          facultyId: userId,
          permissionId: DELETE_SCHOOL_FACULTY_PERMISSION,
        },
      );

    if (!permission)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    await this.userService.delete(userId);
  }
}
