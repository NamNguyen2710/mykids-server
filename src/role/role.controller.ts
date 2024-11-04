import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { RoleService } from 'src/role/role.service';
import { PermissionService } from 'src/role/permission.service';
import { ValidationService } from 'src/users/validation.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { CreateRoleDto, CreateRoleSchema } from 'src/role/dto/create-role.dto';
import { QueryRoleDto, QueryRoleSchema } from 'src/role/dto/query-role.dto';
import {
  UpdatePermissionsDto,
  UpdatePermissionsSchema,
} from 'src/role/dto/update-permissions.dto';
import { ResponseRoleSchema } from 'src/role/dto/response-role.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  CREATE_ROLE_PERMISSION,
  DELETE_ROLE_PERMISSION,
  READ_PERMISSION_PERMISSION,
  READ_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async findAll(
    @Request() req: RequestWithUser,
    @Query(new ZodValidationPipe(QueryRoleSchema)) query: QueryRoleDto,
  ) {
    if (req.user.roleId === Role.SUPER_ADMIN) {
      return this.roleService.findAll(query.schoolId);
    } else {
      const permission =
        await this.validationService.validateSchoolFacultyPermission(
          req.user.id,
          {
            schoolId: req.user.faculty.schoolId,
            permissionId: READ_ROLE_PERMISSION,
          },
        );
      if (!permission)
        throw new ForbiddenException('You do not have permission to read role');

      return this.roleService.findAll(req.user.faculty.schoolId);
    }
  }

  @Get(':id')
  async findOne(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: request.user.faculty?.schoolId,
          permissionId: READ_ROLE_PERMISSION,
        },
      ));
    if (!permission)
      throw new ForbiddenException('You do not have permission to read role');

    const role = await this.roleService.findOne(id);
    if (!role) throw new BadRequestException('Role not found');
    if (role.schoolId !== request.user.faculty?.schoolId)
      throw new ForbiddenException('You do not have permission to read role');

    return ResponseRoleSchema.parse(role);
  }

  @Post()
  async create(
    @Request() request: RequestWithUser,
    @Body(new ZodValidationPipe(CreateRoleSchema)) role: CreateRoleDto,
  ) {
    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: role.schoolId,
          permissionId: CREATE_ROLE_PERMISSION,
        },
      ));
    if (!permission)
      throw new ForbiddenException('You do not have permission to create role');

    return this.roleService.create(role);
  }

  @Put(':id')
  async update(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body('name') roleName: string,
  ) {
    const role = await this.roleService.findOne(id);
    if (!role) throw new BadRequestException('Role not found');

    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: role.schoolId,
          permissionId: UPDATE_ROLE_PERMISSION,
        },
      ));
    if (!permission)
      throw new ForbiddenException('You do not have permission to update role');

    return this.roleService.update(id, roleName);
  }

  @Delete(':id')
  async delete(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const role = await this.roleService.findOne(id);
    if (!role) throw new BadRequestException('Role not found');

    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: role.schoolId,
          permissionId: DELETE_ROLE_PERMISSION,
        },
      ));
    if (!permission)
      throw new ForbiddenException('You do not have permission to delete role');

    return this.roleService.delete(id);
  }

  @Get(':id/permissions')
  async findPermissionsByRole(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const role = await this.roleService.findOne(id);
    if (!role) throw new BadRequestException('Role not found');

    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: role.schoolId,
          permissionId: READ_PERMISSION_PERMISSION,
        },
      ));
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to read role permissions',
      );

    const permissions = await this.permissionService.findPermissionsByRole(id);
    return permissions;
  }

  @Put(':id/permissions')
  async updatePermissions(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) roleId: number,
    @Body(new ZodValidationPipe(UpdatePermissionsSchema))
    body: UpdatePermissionsDto,
  ) {
    const role = await this.roleService.findOne(roleId);
    if (!role) throw new BadRequestException('Role not found');

    const permission =
      request.user.roleId === Role.SUPER_ADMIN ||
      (await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        {
          schoolId: role.schoolId,
          permissionId: UPDATE_ROLE_PERMISSION,
        },
      ));
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to update role permissions',
      );

    const newPermisions = await this.permissionService.update(roleId, body);
    return newPermisions;
  }
}
