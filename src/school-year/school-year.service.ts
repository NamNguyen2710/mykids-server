import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';

@Injectable()
export class SchoolYearService {
  constructor(
    @InjectRepository(SchoolYears)
    private readonly schoolYearRepo: Repository<SchoolYears>,
  ) {}

  async create(createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYears> {
    const schoolYear = this.schoolYearRepo.create(createSchoolYearDto);
    await this.schoolYearRepo.save(schoolYear);

    return schoolYear;
  }

  async findAll(schoolId: number): Promise<SchoolYears[]> {
    const schoolYears = await this.schoolYearRepo.find({
      where: { schoolId },
      order: { startDate: 'DESC' },
    });

    return schoolYears;
  }

  async findOne(id: number) {
    return `This action returns a #${id} schoolYear`;
  }

  async update(id: number, updateSchoolYearDto: UpdateSchoolYearDto) {
    const res = await this.schoolYearRepo.update(id, updateSchoolYearDto);
    if (res.affected === 0) return null;

    return this.schoolYearRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const res = await this.schoolYearRepo.delete(id);
    if (res.affected === 0) return false;

    return true;
  }
}
