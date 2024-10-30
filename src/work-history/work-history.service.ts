import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { WorkHistories } from './entities/work-history.entity';

@Injectable()
export class WorkHistoryService {
  constructor(
    @InjectRepository(WorkHistories)
    private readonly workHistoryRepository: Repository<WorkHistories>,
  ) {}

  async startWorkHistory(classId: number, facultyId: number, startDate: Date) {
    const workHistory = this.workHistoryRepository.create({
      facultyId,
      classId,
      startDate,
    });

    await this.workHistoryRepository.save(workHistory);

    return workHistory;
  }

  async findOne(classId: number, facultyId: number) {
    const workHistory = await this.workHistoryRepository.findOne({
      where: { facultyId, classId },
    });
    return workHistory;
  }

  async endWorkHistory(
    classId: number,
    facultyId: number,
    transactionalManager?: EntityManager,
  ) {
    const workHistory = await this.findOne(classId, facultyId);

    if (!workHistory) throw new BadRequestException('Work history not found');
    if (workHistory.endDate)
      throw new BadRequestException('Work history already ended');

    const manager = transactionalManager || this.workHistoryRepository.manager;

    workHistory.endDate = new Date();
    await manager.save(workHistory);

    return workHistory;
  }

  async delete(classId: number, facultyId: number) {
    const res = await this.workHistoryRepository.delete({ facultyId, classId });

    if (res.affected === 0)
      throw new BadRequestException('Work history not found');
  }
}
