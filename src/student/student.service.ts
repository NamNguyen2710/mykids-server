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

  async findAll(query: QueryStudentDto): Promise<any> {
    const {
      name,
      schoolId,
      classId,
      limit = 20,
      page = 1,
      hasNoClass = false,
    } = query;

    const qb = this.studentRepository
      .createQueryBuilder('s')
      .andWhere('s.isActive = true')
      .andWhere('classroom.is_active = true')
      .limit(limit)
      .offset((page - 1) * limit);

    if (name)
      qb.andWhere('s.first_name ILIKE :name OR s.last_name ILIKE :name', {
        name: `%${name}%`,
      });

    if (schoolId) qb.andWhere('s.school_id = :schoolId', { schoolId });
    if (classId) qb.andWhere('history.class_id = :classId', { classId });
    if (hasNoClass)
      qb.leftJoin('s.history', 'history')
        .leftJoin('history.classroom', 'classroom')
        .groupBy('s.id')
        .having(
          'SUM(CASE WHEN classroom.is_active = true THEN 1 ELSE 0 END) = 0',
        );
    else
      qb.leftJoinAndSelect('s.history', 'history').leftJoinAndSelect(
        'history.classroom',
        'classroom',
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
        classroom: {
          description: s.history_description,
          id: s.classroom_class_id,
          name: s.classroom_name,
        },
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
    let parents, studentCvs;
    if (updateStudentDto.parentIds) {
      parents = await this.userService.findByIds(updateStudentDto.parentIds);
      if (parents.length !== updateStudentDto.parentIds.length)
        throw new NotFoundException('Cannot find parents!');

      delete updateStudentDto.parentIds;
      (updateStudentDto as any).parents = parents;
    }

    if (updateStudentDto.studentCvIds) {
      studentCvs = await this.assetService.findByIds(
        updateStudentDto.studentCvIds,
      );
      if (studentCvs.length !== updateStudentDto.studentCvIds.length)
        throw new NotFoundException('Cannot find student CVs!');

      delete updateStudentDto.studentCvIds;
      (updateStudentDto as any).studentCvs = studentCvs;
    }

    const res = await this.studentRepository.update(id, {
      ...updateStudentDto,
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

  async validateStudentTeacherPermission(
    userId: number,
    studentId: number,
  ): Promise<boolean> {
    const student = await this.studentRepository.findOne({
      where: {
        id: studentId,
        school: { schoolAdminId: userId },
      },
    });

    return !!student;
  }
}
