import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { LoginGuard } from 'src/guard/login.guard';
import { QueryMealDto, QueryMealSchema } from 'src/menu/dto/query-meal.dto';
import { MenuService } from 'src/menu/menu.service';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

@Controller('meal')
@UseGuards(LoginGuard)
export class MealController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMeals(
    @Query(new ZodValidationPipe(QueryMealSchema))
    query: QueryMealDto,
  ) {
    return this.menuService.findMeals(query.q);
  }
}
