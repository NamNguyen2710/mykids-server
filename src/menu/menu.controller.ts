import {
  Body,
  Controller,
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

@Controller('menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getMenus(
    @Request() request,
    @Query(new ZodValidationPipe(QueryMenuSchema)) query: QueryMenuDto,
  ) {
    return this.menuService.findMenus(
      query.classId,
      query.date ? new Date(query.date) : new Date(),
    );
  }

  @Get('meals')
  async getMeals(@Query() query) {
    return this.menuService.findMeals(query.query);
  }

  @Post()
  async createMenu(
    @Request() req,
    @Body(new ZodValidationPipe(MenuDetailSchema)) menu: MenuDetail,
  ) {
    return this.menuService.createMenu(menu);
  }

  @Put(':id')
  async updateMenu(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(MenuDetailSchema)) menu: MenuDetail,
  ) {
    return this.menuService.updateMenu(id, menu);
  }
}
