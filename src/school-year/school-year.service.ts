import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYears } from 'src/school-year/entities/school-year.entity';
import { Classrooms } from 'src/class/entities/class.entity';

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
    const schoolYear = await this.schoolYearRepo.findOne({
      where: { id },
      relations: ['classes'],
    });
    return schoolYear;
  }

  async update(id: number, updateSchoolYearDto: UpdateSchoolYearDto) {
    const res = await this.schoolYearRepo.update(id, updateSchoolYearDto);
    if (res.affected === 0)
      throw new BadRequestException('School year not found');

    return this.schoolYearRepo.findOne({ where: { id } });
  }

  async deactivate(id: number) {
    const schoolYear = await this.schoolYearRepo.findOne({ where: { id } });
    if (!schoolYear) throw new BadRequestException('School year not found');

    await this.schoolYearRepo.manager.transaction(async (manager) => {
      await manager.update(SchoolYears, id, { isActive: false });
      await manager.update(
        Classrooms,
        { schoolYearId: id },
        { isActive: false },
      );
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.schoolYearRepo.delete(id);
    if (res.affected === 0) return false;

    return { status: true, message: 'School year has been deleted' };
  }
}
