import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { MenuService } from 'src/menu/menu.service';

@Controller('menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus(@Request() request, @Query() query) {
    return this.menuService.findMenus(
      request.user.sub,
      query.classId,
      query.date ? new Date(query.date) : new Date(),
    );
  }

  @Get()
  async getMeals(@Request() request, @Query() query) {
    return this.menuService.findMeals(query.query);
  }
}
