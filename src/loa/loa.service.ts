import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { AssetService } from 'src/asset/asset.service';
import { ClassService } from 'src/class/class.service';
import { NotificationsService } from 'src/notifications/notifications.service';

import { LOA_STATUS, Loa } from './entities/loa.entity';

import { ConfigedQueryLoaDto } from './dto/query-loa.dto';
import { CreateLoaDto } from './dto/create-loa.dto';
import { ConfigedUpdateLoaDto } from './dto/update-loa.dto';

@Injectable()
export class LoaService {
  constructor(
    @InjectRepository(Loa)
    private readonly loaRepo: Repository<Loa>,
    private readonly assetService: AssetService,
    private readonly classService: ClassService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(userId: number, createLoaDto: CreateLoaDto) {
    const assets = await this.assetService.findByIds(createLoaDto.assetIds);

    const newLoa = this.loaRepo.create({
      ...createLoaDto,
      createdById: userId,
      createdAt: new Date(),
      reviewStatus: LOA_STATUS.PENDING,
      assets,
    });
    await this.loaRepo.save(newLoa);

    const loa = await this.findOne(newLoa.id);

    this.notificationService.createBulkNotifications({
      schoolId: loa.classroom.schoolId,
      classId: loa.classId,
      title: `${loa.classroom.name} - ${loa.classroom.school.name}`,
      body: `${loa.createdBy.user.firstName} ${loa.createdBy.user.lastName} sent a new Leave of Absence notice for ${loa.student.firstName} ${loa.student.lastName}`,
      data: { loaId: `${loa.id}` },
    });

    return loa;
  }

  async findAll(query: ConfigedQueryLoaDto) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const whereClause: FindOptionsWhere<Loa> = {};

    if (query.schoolId) {
      whereClause.classroom = { schoolId: query.schoolId };
    }
    if (query.studentId) {
      whereClause.student = { id: query.studentId };
    }
    if (query.classId) {
      whereClause.classId = query.classId;
    }
    if (query.facultyId) {
      const { data: classes } = await this.classService.findAll({
        facultyId: query.facultyId,
      });
      whereClause.classId = In(classes.map((c) => c.id));
    }
    if (query.reviewStatus) {
      whereClause.reviewStatus = query.reviewStatus;
    }

    const [data, total] = await this.loaRepo
      .createQueryBuilder('loa')
      .leftJoinAndSelect('loa.student', 'student')
      .leftJoinAndSelect('student.logo', 'studentLogo')
      .leftJoinAndSelect('loa.classroom', 'classroom')
      .leftJoinAndSelect('loa.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.user', 'createdByUser')
      .leftJoinAndSelect('createdByUser.logo', 'createdByUserLogo')
      .leftJoinAndSelect(
        'createdBy.children',
        'children',
        'children.studentId = loa.studentId',
      )
      .leftJoinAndSelect('loa.reviewer', 'reviewer')
      .leftJoinAndSelect('reviewer.user', 'reviewerUser')
      .leftJoinAndSelect('reviewerUser.logo', 'reviewerUserLogo')
      .leftJoinAndSelect('classroom.school', 'school')
      .leftJoinAndSelect('loa.assets', 'assets')
      .take(limit)
      .skip(skip)
      .orderBy('loa.createdAt', 'DESC')
      .getManyAndCount();

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

  async findOne(loaId: number) {
    const loa = await this.loaRepo
      .createQueryBuilder('loa')
      .leftJoinAndSelect('loa.student', 'student')
      .leftJoinAndSelect('student.logo', 'studentLogo')
      .leftJoinAndSelect('loa.classroom', 'classroom')
      .leftJoinAndSelect('loa.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.user', 'createdByUser')
      .leftJoinAndSelect('createdByUser.logo', 'createdByUserLogo')
      .leftJoinAndSelect(
        'createdBy.children',
        'children',
        'children.studentId = loa.studentId',
      )
      .leftJoinAndSelect('loa.reviewer', 'reviewer')
      .leftJoinAndSelect('reviewer.user', 'reviewerUser')
      .leftJoinAndSelect('reviewerUser.logo', 'reviewerUserLogo')
      .leftJoinAndSelect('classroom.school', 'school')
      .leftJoinAndSelect('loa.assets', 'assets')
      .where('loa.id = :loaId', { loaId })
      .getOne();

    if (!loa) throw new NotFoundException('Cannot find LOA notice!');
    return loa;
  }

  async update(loaId: number, updateLoaDto: ConfigedUpdateLoaDto) {
    const loa = await this.findOne(loaId);
    if (!loa) throw new NotFoundException('Cannot find LOA notice!');

    const { reviewer, assetIds, ...updateLoa } = updateLoaDto;

    if (loa.reviewStatus !== LOA_STATUS.PENDING)
      throw new BadRequestException('Cannot update ended LOA notice!');
    else {
      switch (updateLoaDto.reviewStatus) {
        case LOA_STATUS.APPROVE:
          this.notificationService.createNotification({
            userId: loa.createdById,
            title: loa.classroom.school.name,
            body: `${reviewer.firstName} ${reviewer.lastName} has approved LOA notice for ${loa.student.firstName} ${loa.student.lastName}`,
            data: { loaId: `${loa.id}` },
          });
          break;
        case LOA_STATUS.REJECT:
          this.notificationService.createNotification({
            userId: loa.createdById,
            title: loa.classroom.school.name,
            body: `${reviewer.firstName} ${reviewer.lastName} has rejected LOA notice for ${loa.student.firstName} ${loa.student.lastName}`,
            data: { loaId: `${loa.id}` },
          });
          break;
      }
    }

    if (assetIds) {
      const assets = await this.assetService.findByIds(updateLoaDto.assetIds);
      loa.assets = assets;
    }

    const updatedLoa = await this.loaRepo.save({
      ...loa,
      ...updateLoa,
    });
    return updatedLoa;
  }
}
