import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Students } from 'src/student/entities/student.entity';
import { QueryStudentDto } from 'src/student/dto/query-student.dto';
import { ListResponse } from 'src/utils/list-response.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Students)
    private readonly studentRepository: Repository<Students>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    await this.studentRepository.save(student);
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
    const res = await this.studentRepository.update(id, updateStudentDto);
    if (res.affected === 0) return null;

    return this.studentRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.studentRepository.update(id, { isActive: false });
  }
}
