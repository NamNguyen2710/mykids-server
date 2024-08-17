import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClassHistories } from './entities/class-history.entity';
import { UpdateClassHistoryDto } from './dto/update-class-history.dto';

@Injectable()
export class ClassHistoryService {
  constructor(
    @InjectRepository(ClassHistories)
    private classHistoryRepository: Repository<ClassHistories>,
  ) {}

  async create(studentId: number, classId: number) {
    const classHistory = this.classHistoryRepository.create({
      studentId,
      classId,
    });
    await this.classHistoryRepository.save(classHistory);

    return classHistory;
  }

  async findOne(classId: number, studentId: number) {
    const classHistory = await this.classHistoryRepository.findOne({
      where: { classId, studentId },
    });
    return classHistory;
  }

  async update(
    classId: number,
    studentId: number,
    updateClassHistoryDto: UpdateClassHistoryDto,
  ) {
    const res = await this.classHistoryRepository.update(
      { classId, studentId },
      updateClassHistoryDto,
    );
    if (res.affected === 0)
      throw new BadRequestException('Class history not found');

    return this.findOne(classId, studentId);
  }

  async remove(classId: number, studentId: number) {
    const res = await this.classHistoryRepository.delete({
      classId,
      studentId,
    });
    if (res.affected === 0)
      throw new BadRequestException('Class history not found');
  }
}
