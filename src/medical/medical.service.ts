import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateMedicalDto } from './dto/create-medical.dto';
import { QueryMedicalDTO } from './dto/query-medical.dto';

import { Medicals } from './entities/medical.entity';
import { AssetService } from 'src/asset/asset.service';
import { UpdateMedicalDto } from 'src/medical/dto/update-medical.dto';

@Injectable()
export class MedicalService {
  constructor(
    @InjectRepository(Medicals)
    private readonly medicalRepository: Repository<Medicals>,
    private readonly assetService: AssetService,
  ) {}

  async create(createMedicalDto: CreateMedicalDto) {
    const assets = await this.assetService.findByIds(createMedicalDto.assetIds);
    const medical = this.medicalRepository.create({
      ...createMedicalDto,
      assets,
    });

    return this.medicalRepository.save(medical);
  }

  async findAll(query: QueryMedicalDTO) {
    const { limit = 20, page = 1 } = query;
    const whereClause: FindOptionsWhere<Medicals> = {};

    if (query.schoolId) {
      whereClause['school'] = { id: query.schoolId };
    }
    if (query.classId) {
      whereClause['student'] = {
        history: { classroom: { id: query.classId } },
      };
    }
    if (query.studentId) {
      whereClause['student'] = {
        ...((whereClause.student as object) || {}),
        id: query.studentId,
      };
    }

    const [medical, total] = await this.medicalRepository.findAndCount({
      where: whereClause,
      relations: ['student'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: medical,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async findOne(id: number) {
    return this.medicalRepository.findOne({
      where: { id },
      relations: ['student'],
    });
  }

  async update(id: number, medicalDto: UpdateMedicalDto) {
    const medical = await this.medicalRepository.findOne({ where: { id } });
    if (!medical) throw new BadRequestException('Cannot find medical record!');

    if (medicalDto.assetIds) {
      const assets = await this.assetService.findByIds(medicalDto.assetIds);
      medical.assets = assets;
    }

    Object.assign(medical, medicalDto);
    await this.medicalRepository.save(medical);

    return medical;
  }

  async remove(id: number) {
    const res = await this.medicalRepository.delete(id);
    if (res.affected === 0)
      throw new BadRequestException('Cannot find medical record!');

    return { status: true, message: 'Medical record has been deleted!' };
  }

  async validateParentMedicalPermission(parentId: number, medicalId: number) {
    const medical = await this.medicalRepository.findOne({
      where: { id: medicalId, student: { parents: { parentId } } },
    });
    return !!medical;
  }
}
