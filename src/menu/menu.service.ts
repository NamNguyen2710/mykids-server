import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Menus } from 'src/menu/entities/menu.entity';
import { Meals } from 'src/menu/entities/meal.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menus)
    private readonly menuRepository: Repository<Menus>,
    private readonly dataSource: DataSource,
  ) {}

  async findMenus(userId: number, classId: number, date: Date = new Date()) {
    // TODO: Verify userId through student
    const menus = await this.menuRepository.find({
      where: {
        classroom: { id: classId },
        date,
      },
      relations: { meals: true, images: true },
    });
    return menus;
  }

  async createMenus() {}

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
