import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Classrooms } from 'src/class/entities/class.entity';

import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { QueryClassesDto } from 'src/class/dto/query-classes.dto';
import { ListResponse } from 'src/utils/list-response.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classrooms)
    private readonly classRepository: Repository<Classrooms>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Classrooms> {
    const classroom = this.classRepository.create(createClassDto);
    await this.classRepository.save(classroom);

    return classroom;
  }

  async findAll(query: QueryClassesDto): Promise<ListResponse<Classrooms>> {
    const { q = '', schoolId, schoolYearId, page = 1, limit = 20 } = query;

    const qb = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.school', 'school')
      .leftJoinAndSelect('class.schoolYear', 'schoolYear')
      .andWhere('class.name ILIKE :q OR class.location ILIKE :q', {
        q: `%${q}%`,
      })
      .take(limit)
      .skip((page - 1) * limit);

    if (schoolId) qb.andWhere('school.id = :schoolId', { schoolId });

    if (schoolYearId)
      qb.andWhere('schoolYear.id = :schoolYearId', { schoolYearId });

    const [classes, total] = await qb.getManyAndCount();

    return {
      data: classes,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async findOne(id: number): Promise<Classrooms> {
    const classroom = await this.classRepository.findOne({
      where: { id },
      relations: ['school', 'schoolYear', 'students.student.parents.parent'],
    });

    return classroom;
  }

  async update(
    classId: number,
    updateClassDto: UpdateClassDto,
  ): Promise<Classrooms> {
    const res = await this.classRepository.update(classId, updateClassDto);
    if (res.affected === 0) return null;

    const classroom = await this.classRepository.findOne({
      where: { id: classId },
      relations: { school: true, schoolYear: true },
    });
    return classroom;
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.classRepository.delete(id);
    if (res.affected === 0) return false;

    return true;
  }

  async validateSchoolClass(schoolId: number, classId: number) {
    const classroom = await this.classRepository.findOne({
      where: { id: classId, school: { id: schoolId } },
    });
    return !!classroom;
  }

  async validateTeacherClass(userId: number, classId: number) {
    const classroom = await this.classRepository.findOne({
      where: { id: classId, school: { schoolAdminId: userId } },
    });
    return !!classroom;
  }
}
