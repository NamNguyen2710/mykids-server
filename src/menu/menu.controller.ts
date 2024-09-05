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
import { UserService } from 'src/users/users.service';

import { MenuDetail, MenuDetailSchema } from 'src/menu/dto/menu-detail.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { QueryMenuDto, QueryMenuSchema } from 'src/menu/dto/query-menu.dto';
import { ClassService } from 'src/class/class.service';

@Controller('menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly userService: UserService,
    private readonly classService: ClassService,
  ) {}

  @Get()
  async getMenus(
    @Request() request,
    @Query(new ZodValidationPipe(QueryMenuSchema)) query: QueryMenuDto,
  ) {
    const permission =
      (await this.classService.validateTeacherClass(
        request.user.sub,
        query.classId,
      )) ||
      (await this.userService.validateParentClassPermission(
        request.user.sub,
        query.classId,
      ));
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
    const permission = await this.classService.validateTeacherClass(
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
    const permission = await this.classService.validateTeacherClass(
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
