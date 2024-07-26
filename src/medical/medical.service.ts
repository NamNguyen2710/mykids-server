import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalDto } from './dto/create-medical.dto';
import { QueryMedicalDTO } from './dto/query-medical.dto';
import { Medicals } from './entities/medical.entity';
import { SchoolService } from 'src/school/school.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MedicalService {
  constructor(
    @InjectRepository(Medicals)
    private readonly medicalRepository: Repository<Medicals>,
    private readonly schoolService: SchoolService,
  ) {}
  create(createMedicalDto: CreateMedicalDto) {
    return 'This action adds a new medical';
  }

  async findAllSchoolMedical(schoolId: number, query: QueryMedicalDTO) {
    const school = await this.schoolService.findOne(schoolId);

    if (!school) throw new NotFoundException('Cannot find this school!');

    const { limit = 20, page = 1 } = query;

    const [medical, total] = await this.medicalRepository.findAndCount({
      where: { school: { id: schoolId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: medical,
      pagination: {
        total: total,
        totalPage: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} medical`;
  }

  remove(id: number) {
    return `This action removes a #${id} medical`;
  }
}
