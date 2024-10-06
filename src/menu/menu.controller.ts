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
import * as Role from 'src/users/entity/roles.data';
import { Users } from 'src/users/entity/users.entity';

@Controller('menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async getMenus(
    @Request() request,
    @Query(new ZodValidationPipe(QueryMenuSchema)) query: QueryMenuDto,
  ) {
    let permission: Users | null = null;
    if (request.user.role === Role.SchoolAdmin.name)
      permission =
        await this.validationService.validateSchoolAdminClassPermission(
          request.user.sub,
          query.classId,
        );
    if (request.user.role === Role.Parent.name)
      await this.validationService.validateParentClassPermission(
        request.user.sub,
        query.classId,
      );
    if (!permission) {
      throw new ForbiddenException(
        'You dont have permission to access this class information',
      );
    }

    return this.menuService.findMenus(
      query.classId,
      query.startDate || query.date || new Date(),
      query.endDate || query.date || new Date(),
    );
  }

  @Get('meals')
  async getMeals(@Query() query) {
    return this.menuService.findMeals(query.query);
  }

  @Post()
  async createMenu(
    @Request() request,
    @Body(new ZodValidationPipe(MenuDetailSchema)) menu: MenuDetail,
  ) {
    const permission =
      await this.validationService.validateSchoolAdminClassPermission(
        request.user.sub,
        menu.classId,
      );
    if (!permission) {
      throw new ForbiddenException(
        'You dont have permission to update this class information',
      );
    }

    return this.menuService.createMenu(menu);
  }

  @Put(':id')
  async updateMenu(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(MenuDetailSchema)) menu: MenuDetail,
  ) {
    const permission =
      await this.validationService.validateSchoolAdminClassPermission(
        request.user.sub,
        menu.classId,
      );
    if (!permission) {
      throw new ForbiddenException(
        'You dont have permission to update this class information',
      );
    }

    return this.menuService.updateMenu(id, menu);
  }
}
