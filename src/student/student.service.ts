import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/users/users.service';
import { SchoolService } from 'src/school/school.service';
import { AssetService } from 'src/asset/asset.service';

import { Students } from './entities/student.entity';
import { StudentsParents } from './entities/students-parents.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { ListResponse } from 'src/utils/list-response.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Students)
    private readonly studentRepository: Repository<Students>,
    @InjectRepository(StudentsParents)
    private readonly stdParentRepository: Repository<StudentsParents>,
    private readonly userService: UserService,
    private readonly schoolService: SchoolService,
    private readonly assetService: AssetService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const parents = await Promise.all(
      createStudentDto.parentIds.map(async (parentId) => {
        const parent = await this.userService.findOne(parentId);
        return this.stdParentRepository.create({ parent });
      }),
    );

    const student = this.studentRepository.create({
      ...createStudentDto,
      parents,
    });

    await this.studentRepository.manager.transaction(async (manager) => {
      await manager.save(student);
      await this.schoolService.addParents(
        createStudentDto.schoolId,
        parents.map((parent) => parent.parentId),
        manager,
      );
    });
    return student;
  }

  async findAll(query: QueryStudentDto): Promise<ListResponse<Students>> {
    const { name, schoolId, classId, limit = 20, page = 1 } = query;
    const qb = this.studentRepository
      .createQueryBuilder('s')
      .andWhere('s.isActive = :isActive', { isActive: true })
      .take(limit)
      .skip((page - 1) * limit);

    if (name)
      qb.andWhere('s.first_name ILIKE :name OR s.last_name ILIKE :name', {
        name: `%${name}%`,
      });

    if (schoolId) qb.andWhere('s.school_id = :schoolId', { schoolId });
    if (classId) qb.andWhere('s.class_id = :classId', { classId });

    const [students, total] = await qb.getManyAndCount();

    return {
      data: students,
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
    let parents, studentCvs;
    if (updateStudentDto.parentIds) {
      parents = await this.userService.findByIds(updateStudentDto.parentIds);
      if (parents.length !== updateStudentDto.parentIds.length)
        throw new NotFoundException('Cannot find parents!');

      delete updateStudentDto.parentIds;
    }

    if (updateStudentDto.studentCvIds) {
      studentCvs = await this.assetService.findByIds(
        updateStudentDto.studentCvIds,
      );
      if (studentCvs.length !== updateStudentDto.studentCvIds.length)
        throw new NotFoundException('Cannot find student CVs!');

      delete updateStudentDto.studentCvIds;
    }

    const res = await this.studentRepository.update(id, {
      ...updateStudentDto,
      parents,
      studentCvs,
    });
    if (res.affected === 0) return null;

    return this.studentRepository.findOne({ where: { id } });
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
