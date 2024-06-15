import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Menus } from 'src/menu/entities/menu.entity';
import { Meals } from 'src/menu/entities/meal.entity';
import { MenuDetail } from 'src/menu/dto/menu-detail.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menus) private readonly menuRepository: Repository<Menus>,
    @InjectRepository(Meals) private readonly mealRepository: Repository<Meals>,
    private readonly dataSource: DataSource,
  ) {}

  async findMenus(classId: number, date: Date = new Date()) {
    const menus = await this.menuRepository.find({
      where: { classroom: { id: classId }, date },
    });
    return menus;
  }

  async createMenu(menuDetail: MenuDetail) {
    const meals = this.mealRepository.create(menuDetail.meals);

    const menu = {
      ...menuDetail,
      meals,
      classroom: { id: menuDetail.classId } as any,
    };

    const newMenu = this.menuRepository.create(menu);
    await this.menuRepository.save(newMenu);

    return this.menuRepository.findOne({ where: { id: newMenu.id } });
  }

  async updateMenu(menuId: number, menuDetail: MenuDetail) {
    const menu = await this.menuRepository.findOne({ where: { id: menuId } });
    if (!menu) throw new BadRequestException('Menu not found');

    const meals = menuDetail.meals.map((meal) => {
      if (meal.id && menu.meals.every((m) => m.id !== meal.id)) delete meal.id;
      const newMeal = this.mealRepository.create(meal);
      return newMeal;
    });

    Object.assign(menu, menuDetail, { meals });
    await this.menuRepository.save(menu);
    return this.menuRepository.findOne({ where: { id: menuId } });
  }

  async findMeals(query: string) {
    const meals = await this.dataSource
      .createQueryBuilder()
      .select('m.*')
      .addFrom(
        (subQuery) =>
          subQuery
            .select([
              'm.*',
              'ROW_NUMBER() OVER (PARTITION BY m.name ORDER BY m.meal_id DESC) AS rn',
            ])
            .from(Meals, 'm')
            .where('m.name ILIKE :query', { query: `%${query}%` }),
        'm',
      )
      .where('m.rn = 1')
      .orderBy('m.name')
      .take(10)
      .getRawMany();

    return meals;
  }
}
