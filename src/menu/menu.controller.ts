import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { MenuService } from 'src/menu/menu.service';
import { UserService } from 'src/users/users.service';

import { MenuDetail } from 'src/menu/dto/menu-detail.dto';

@Controller('menu')
@UseGuards(LoginGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getMenus(@Request() request, @Query() query) {
    const classId = parseInt(query.classId);
    if (!classId) throw new BadRequestException('Invalid class id');

    const validatePermission =
      await this.userService.validateParentClassPermission(
        request.user.sub,
        classId,
      );

    if (!validatePermission)
      throw new UnauthorizedException('Invalid class id');

    return this.menuService.findMenus(
      classId,
      query.date ? new Date(query.date) : new Date(),
    );
  }

  @Get('meals')
  async getMeals(@Query() query) {
    return this.menuService.findMeals(query.query);
  }

  @Post()
  async createMenu(@Request() req, @Body() menu: MenuDetail) {
    const validatePermission =
      await this.userService.validateParentClassPermission(
        req.user.sub,
        menu.classId,
      );

    if (!validatePermission)
      throw new UnauthorizedException('Invalid class id');

    return this.menuService.createMenu(menu);
  }

  @Put(':id')
  async updateMenu(
    @Request() req,
    @Param('id') id: string,
    @Body() menu: MenuDetail,
  ) {
    const menuId = parseInt(id);
    if (!menuId) throw new BadRequestException('Invalid menu id');

    const validatePermission =
      await this.userService.validateParentClassPermission(
        req.user.sub,
        menu.classId,
      );

    if (!validatePermission)
      throw new UnauthorizedException('Invalid class id');

    return this.menuService.updateMenu(menuId, menu);
  }
}
