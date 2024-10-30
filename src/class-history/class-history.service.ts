import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, In } from 'typeorm';

import { ClassHistories } from './entities/class-history.entity';
import { UpdateClassHistoryDto } from './dto/update-class-history.dto';

@Injectable()
export class ClassHistoryService {
  constructor(
    @InjectRepository(ClassHistories)
    private classHistoryRepository: Repository<ClassHistories>,
  ) {}

  async startClassHistories(
    classId: number,
    studentIds: number[],
    startDate: Date,
  ) {
    const classHistory = studentIds.map((studentId) =>
      this.classHistoryRepository.create({
        studentId,
        classId,
        startDate,
      }),
    );
    await this.classHistoryRepository.save(classHistory);

    return classHistory;
  }

  async findOne(classId: number, studentId: number) {
    const classHistory = await this.classHistoryRepository.findOne({
      where: { classId, studentId },
    });
    return classHistory;
  }

  async findByStudentIds(studentIds: number[]) {
    const classHistories = await this.classHistoryRepository.find({
      where: { studentId: In(studentIds), endDate: null },
    });
    return classHistories;
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

  async endClassHistory(
    classId: number,
    studentId: number,
    transactionalManager?: EntityManager,
  ) {
    const classHistory = await this.findOne(classId, studentId);
    if (!classHistory) throw new BadRequestException('Class history not found');

    const manager = transactionalManager || this.classHistoryRepository.manager;
    classHistory.endDate = new Date();
    await manager.save(classHistory);

    return classHistory;
  }

  async delete(classId: number, studentId: number) {
    const res = await this.classHistoryRepository.delete({
      classId,
      studentId,
    });

    if (res.affected === 0)
      throw new BadRequestException('Class history not found');
  }
}
