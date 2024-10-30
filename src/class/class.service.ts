import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Classrooms } from 'src/class/entities/class.entity';

import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ConfigedQueryClassesDto } from 'src/class/dto/query-classes.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classrooms)
    private readonly classRepository: Repository<Classrooms>,
  ) {}

  async create(schoolId: number, createClassDto: CreateClassDto) {
    const classroom = this.classRepository.create({
      ...createClassDto,
      schoolId,
    });
    await this.classRepository.save(classroom);

    return classroom;
  }

  async findAll(query: ConfigedQueryClassesDto) {
    const {
      q = '',
      schoolId,
      schoolYearId,
      facultyId,
      page = 1,
      limit = 20,
      isActive = true,
    } = query;

    const qb = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.school', 'school')
      .leftJoinAndSelect('class.schoolYear', 'schoolYear')
      .where('(class.name ILIKE :q OR class.location ILIKE :q)', {
        q: `%${q}%`,
      })
      .orderBy('schoolYear.startDate', 'DESC')
      .addOrderBy('class.id', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    if (isActive !== undefined)
      qb.andWhere('class.isActive = :isActive', { isActive });

    if (schoolId) qb.andWhere('school.id = :schoolId', { schoolId });

    if (schoolYearId)
      qb.andWhere('schoolYear.id = :schoolYearId', { schoolYearId });

    if (facultyId)
      qb.innerJoin('class.faculties', 'faculty').andWhere(
        'faculty.facultyId = :facultyId',
        { facultyId },
      );

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
      relations: [
        'school',
        'schoolYear',
        'students.student.parents.parent.user',
      ],
    });
    console.log(classroom.students[0]);

    return classroom;
  }

  async update(
    classId: number,
    updateClassDto: UpdateClassDto,
  ): Promise<Classrooms> {
    const res = await this.classRepository.update(classId, updateClassDto);
    if (res.affected === 0) throw new BadRequestException('Class not found');

    const classroom = await this.classRepository.findOne({
      where: { id: classId },
      relations: { school: true, schoolYear: true },
    });
    return classroom;
  }

  async deactivate(id: number): Promise<Classrooms> {
    const classroom = await this.classRepository.findOne({
      where: { id },
      relations: { students: true, faculties: true },
    });
    if (!classroom) throw new BadRequestException('Class not found');

    classroom.isActive = false;
    classroom.students.forEach((student) => (student.endDate = new Date()));
    classroom.faculties.forEach((faculty) => (faculty.endDate = new Date()));
    await this.classRepository.save(classroom);

    return classroom;
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.classRepository.delete(id);
    if (res.affected === 0) return false;

    return true;
  }
}
