import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, EntityManager } from 'typeorm';

import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from 'src/school/dto/query-school.dto';
import { Schools } from 'src/school/entities/school.entity';
import { Parents } from 'src/users/entity/parent.entity';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(Schools)
    private readonly schoolRepository: Repository<Schools>,
    private readonly roleService: RoleService,
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepository.create(createSchoolDto);
    await this.schoolRepository.save(school);

    await this.roleService.create({
      name: 'Super Admin',
      schoolId: school.id,
    });

    return school;
  }

  async findAll(query: QuerySchoolDto) {
    const { name = '', limit = 20, page = 1 } = query;

    const [schools, total] = await this.schoolRepository.findAndCount({
      where: { name: ILike(`%${name}%`) },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: schools,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    const res = await this.schoolRepository.update(id, updateSchoolDto);
    if (res.affected === 0)
      return {
        status: 'error',
        message: `School with id ${id} not found`,
      };

    const school = await this.schoolRepository.findOne({
      where: { id },
    });

    return school;
  }

  async deactivateSchool(id: number) {
    const res = await this.schoolRepository.update(id, { isActive: false });

    if (res.affected === 0)
      return {
        status: 'error',
        message: `School with id ${id} not found`,
      };

    return {
      status: 'success',
      message: `School with id ${id} has been deactivated`,
    };
  }

  async activateSchool(id: number) {
    const res = await this.schoolRepository.update(id, { isActive: true });

    if (res.affected === 0)
      return {
        status: 'error',
        message: `School with id ${id} not found`,
      };

    return {
      status: 'success',
      message: `School with id ${id} has been activated`,
    };
  }

  async addParents(
    schoolId: number,
    parentIds: number[],
    transactionalManager?: EntityManager,
  ) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
      relations: ['parents'],
    });
    if (!school) throw new NotFoundException('School not found');

    parentIds.forEach((parentId) =>
      school.parents.push({ userId: parentId } as Parents),
    );
    const manager = transactionalManager || this.schoolRepository.manager;
    await manager.save(school);
  }

  async removeParents(
    schoolId: number,
    parentIds: number[],
    transactionalManager?: EntityManager,
  ) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
      relations: ['parents'],
    });
    if (!school) throw new NotFoundException('School not found');

    school.parents = school.parents.filter((parent) =>
      parentIds.every((parentId) => parentId !== parent.userId),
    );
    const manager = transactionalManager || this.schoolRepository.manager;
    await manager.save(school);
  }
}
