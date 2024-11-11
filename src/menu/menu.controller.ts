import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { MenuService } from 'src/menu/menu.service';
import { ValidationService } from 'src/users/validation.service';

import { MenuDetail, MenuDetailSchema } from 'src/menu/dto/menu-detail.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { QueryMenuDto, QueryMenuSchema } from 'src/menu/dto/query-menu.dto';

import { Role } from 'src/role/entities/roles.data';
import {
  CREATE_ASSIGNED_CLASS_MENU_PERMISSION,
  CREATE_CLASS_MENU_PERMISSION,
  READ_ASSIGNED_CLASS_MENU_PERMISSION,
  READ_ALL_CLASS_MENU_PERMISSION,
  UPDATE_ASSIGNED_CLASS_MENU_PERMISSION,
  UPDATE_CLASS_MENU_PERMISSION,
} from 'src/role/entities/permission.data';
import { RequestWithUser } from 'src/utils/request-with-user';

@Controller('class/:classId/menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async getMenus(
    @Request() request: RequestWithUser,
    @Param('classId', ParseIntPipe) classId: number,
    @Query(new ZodValidationPipe(QueryMenuSchema)) query: QueryMenuDto,
  ) {
    let permission;

    if (request.user.roleId === Role.PARENT) {
      permission = await this.validationService.validateParentClassPermission(
        request.user.id,
        classId,
      );
    } else if (request.user.roleId !== Role.SUPER_ADMIN) {
      const res =
        await this.validationService.validateFacultySchoolClassPermission({
          userId: request.user.id,
          schoolId: request.user.faculty?.schoolId,
          classId,
          allPermissionId: READ_ALL_CLASS_MENU_PERMISSION,
          classPermissionId: READ_ASSIGNED_CLASS_MENU_PERMISSION,
        });

      permission = res.allPermission || res.classPermission;
    }

    if (!permission) {
      throw new ForbiddenException(
        'You dont have permission to access this class information',
      );
    }

    return this.menuService.findMenus(
      classId,
      query.startDate || query.date || new Date(),
      query.endDate || query.date || new Date(),
    );
  }

  @Post()
  async createMenu(
    @Request() request: RequestWithUser,
    @Body(new ZodValidationPipe(MenuDetailSchema)) menu: MenuDetail,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: menu.classId,
        allPermissionId: CREATE_CLASS_MENU_PERMISSION,
        classPermissionId: CREATE_ASSIGNED_CLASS_MENU_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission) {
      throw new ForbiddenException(
        'You dont have permission to update this class information',
      );
    }

    return this.menuService.createMenu(menu);
  }

  @Put(':id')
  async updateMenu(
    @Request() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(MenuDetailSchema)) menu: MenuDetail,
  ) {
    const permission =
      await this.validationService.validateFacultySchoolClassPermission({
        userId: request.user.id,
        schoolId: request.user.faculty?.schoolId,
        classId: menu.classId,
        allPermissionId: UPDATE_CLASS_MENU_PERMISSION,
        classPermissionId: UPDATE_ASSIGNED_CLASS_MENU_PERMISSION,
      });

    if (!permission.allPermission && !permission.classPermission) {
      throw new ForbiddenException(
        'You dont have permission to update this class information',
      );
    }

    return this.menuService.updateMenu(id, menu);
  }
}
