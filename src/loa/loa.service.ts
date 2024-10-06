import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { AssetService } from 'src/asset/asset.service';

import { LOA_STATUS, Loa } from './entities/loa.entity';
import * as Role from 'src/users/entity/roles.data';
import { QueryLoaDto } from './dto/query-loa.dto';
import { CreateLoaDto } from './dto/create-loa.dto';
import { UpdateLoaDto } from './dto/update-loa.dto';
import { ListResponse } from 'src/utils/list-response.dto';

@Injectable()
export class LoaService {
  constructor(
    @InjectRepository(Loa) private readonly loaRepo: Repository<Loa>,
    private readonly assetService: AssetService,
  ) {}

  async create(userId: number, createLoaDto: CreateLoaDto): Promise<Loa> {
    const assets = await this.assetService.findByIds(createLoaDto.assetIds);

    const loa = this.loaRepo.create({
      ...createLoaDto,
      createdById: userId,
      approveStatus: LOA_STATUS.PENDING,
      assets,
    });
    await this.loaRepo.save(loa);

    return this.loaRepo.findOne({
      where: { id: loa.id },
      relations: ['student', 'classroom', 'createdBy'],
    });
  }

  async findAll(
    query: QueryLoaDto,
    userId: number,
    userRole: string,
  ): Promise<ListResponse<Loa>> {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    if (userRole == Role.SchoolAdmin.name) {
      const whereClause: FindOptionsWhere<Loa> = {
        student: { school: { schoolAdminId: userId } },
      };

      if (query.studentId) {
        whereClause.student = { id: query.studentId };
      }
      if (query.classId) {
        whereClause.classroom = { id: query.classId };
      }

      const [data, total] = await this.loaRepo.findAndCount({
        where: whereClause,
        relations: ['student', 'classroom', 'createdBy'],
        take: limit,
        skip: skip,
      });

      return {
        data,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          page: page,
          limit: limit,
        },
      };
    }

    if (userRole == Role.Parent.name) {
      if (!query.studentId) throw new BadRequestException('Missing student id');
      if (!query.classId) throw new BadRequestException('Missing class id');

      const [data, total] = await this.loaRepo.findAndCount({
        where: {
          student: { parents: { parentId: userId } },
          studentId: query.studentId,
          classId: query.classId,
        },
        relations: ['student', 'classroom', 'createdBy'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: skip,
      });

      return {
        data,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          page: page,
          limit: limit,
        },
      };
    }
  }

  async findOne(loaId: number) {
    const loa = this.loaRepo.findOne({
      where: { id: loaId },
      relations: ['student', 'classroom', 'createdBy'],
    });

    if (!loa) throw new NotFoundException('Cannot find LOA notice!');
    return loa;
  }

  async update(loaId: number, updateLoaDto: UpdateLoaDto) {
    const loa = await this.loaRepo.findOne({
      where: { id: loaId },
      relations: ['student', 'classroom', 'createdBy'],
    });
    if (!loa) throw new NotFoundException('Cannot find LOA notice!');

    if (updateLoaDto.assetIds) {
      const assets = await this.assetService.findByIds(updateLoaDto.assetIds);
      loa.assets = assets;
    }

    if (loa.approveStatus != LOA_STATUS.PENDING)
      throw new BadRequestException('Cannot update ended LOA notice!');

    const updatedLoa = await this.loaRepo.save({
      ...loa,
      ...updateLoaDto,
    });
    return updatedLoa;
  }

  async validateLoaAdminPermission(loaId: number, userId: number) {
    const loa = await this.loaRepo.findOne({
      where: { id: loaId, classroom: { school: { schoolAdminId: userId } } },
    });

    return !!loa;
  }

  async validateLoaParentPermission(loaId: number, userId: number) {
    const loa = await this.loaRepo.findOne({
      where: { id: loaId, student: { parents: { parentId: userId } } },
    });

    return !!loa;
  }
}
