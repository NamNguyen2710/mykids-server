import { Injectable } from '@nestjs/common';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

@Injectable()
export class SchoolYearService {
  create(createSchoolYearDto: CreateSchoolYearDto) {
    return 'This action adds a new schoolYear';
  }

  findAll() {
    return `This action returns all schoolYear`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schoolYear`;
  }

  update(id: number, updateSchoolYearDto: UpdateSchoolYearDto) {
    return `This action updates a #${id} schoolYear`;
  }

  remove(id: number) {
    return `This action removes a #${id} schoolYear`;
  }
}
