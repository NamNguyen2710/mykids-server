import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuController } from 'src/menu/menu.controller';
import { Meals } from 'src/menu/entities/meal.entity';
import { Menus } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menus, Meals]), ClassModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
