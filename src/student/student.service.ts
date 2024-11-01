import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SchoolService } from 'src/school/school.service';
import { AssetService } from 'src/asset/asset.service';

import { Students } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Students)
    private readonly studentRepository: Repository<Students>,
    private readonly schoolService: SchoolService,
    private readonly assetService: AssetService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create({
      ...createStudentDto,
    });

    if (createStudentDto.logoId) {
      const logo = await this.assetService.findByIds([createStudentDto.logoId]);
      if (logo.length === 0) throw new NotFoundException('Cannot find logo!');
      student.logo = logo[0];
    }

    await this.studentRepository.manager.transaction(async (manager) => {
      await manager.save(student);
    });
    return student;
  }

  async findAll(query: QueryStudentDto): Promise<any> {
    const {
      name,
      schoolId,
      classId,
      limit = 20,
      page = 1,
      hasNoClass = false,
      isActive,
      sort = 'name',
      order = 'ASC',
    } = query;

    const qb = this.studentRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.logo', 'logo')
      .leftJoin('s.history', 'history')
      .leftJoin('history.classroom', 'classroom', 'classroom.is_active = true')
      .limit(limit)
      .groupBy('s.id')
      .addGroupBy('logo.id')
      .addSelect([
        `COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', classroom.id, 
              'name', classroom.name, 
              'description', history.description,
              'isActive', classroom.is_active
            ) 
          ) FILTER (WHERE classroom.id IS NOT NULL AND classroom.is_active = true), 
          '[]'
        ) AS history`,
      ])
      .offset((page - 1) * limit);

    if (isActive !== undefined)
      qb.andWhere('s.is_active = :isActive', { isActive });

    if (sort === 'name')
      qb.orderBy('s.first_name', order).addOrderBy('s.last_name', order);
    else qb.orderBy(`s.${sort}`, order);

    if (name)
      qb.andWhere('(s.first_name ILIKE :name OR s.last_name ILIKE :name)', {
        name: `%${name}%`,
      });

    if (schoolId) qb.andWhere('s.school_id = :schoolId', { schoolId });
    if (classId) qb.andWhere('classroom.id = :classId', { classId });
    if (hasNoClass)
      qb.having(
        'SUM(CASE WHEN classroom.is_active = true THEN 1 ELSE 0 END) = 0',
      );

    const students = await qb.getRawMany();
    const total = await qb.getCount();

    return {
      data: students.map((s) => ({
        id: s.s_student_id,
        firstName: s.s_first_name,
        lastName: s.s_last_name,
        dateOfBirth: s.s_date_of_birth,
        currentAddress: s.s_current_address,
        ethnic: s.s_ethnic,
        gender: s.s_gender,
        isActive: s.s_is_active,
        logo: s.logo_asset_id && {
          id: s.logo_asset_id,
          url: s.logo_url,
        },
        classroom: s.history[0] || null,
      })),
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async findOne(id: number, relations: string[] = []) {
    return this.studentRepository.findOne({ where: { id }, relations });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (updateStudentDto.studentCvIds) {
      const studentCvs = await this.assetService.findByIds(
        updateStudentDto.studentCvIds,
      );
      if (studentCvs.length !== updateStudentDto.studentCvIds.length)
        throw new NotFoundException('Cannot find student CVs!');

      delete updateStudentDto.studentCvIds;
      student.studentCvs = studentCvs;
    }

    if (updateStudentDto.logoId) {
      const logo = await this.assetService.findByIds([updateStudentDto.logoId]);
      if (logo.length === 0) throw new NotFoundException('Cannot find logo!');
      student.logo = logo[0];
    }

    await this.studentRepository.save({
      ...student,
      ...updateStudentDto,
    });

    return this.studentRepository.findOne({
      where: { id },
      relations: ['parents.parent.user'],
    });
  }

  async deactivate(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    await this.studentRepository.manager.transaction(async (manager) => {
      await manager.update(Students, id, { isActive: false });
      await this.schoolService.removeParents(
        student.schoolId,
        student.parents.map((p) => p.parentId),
        manager,
      );
    });
  }

  async activate(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    await this.studentRepository.manager.transaction(async (manager) => {
      await manager.update(Students, id, { isActive: true });
      await this.schoolService.addParents(
        student.schoolId,
        student.parents.map((p) => p.parentId),
        manager,
      );
    });
  }
}
