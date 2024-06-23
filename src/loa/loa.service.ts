import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLoaDto } from './dto/create-loa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loa } from './entities/loa.entity';
import { Users } from 'src/users/entity/users.entity';
import { QueryLoaDto } from './dto/query-loa.dto';
import { Students } from 'src/student/entities/student.entity';
import { ClassHistories } from 'src/class-history/entities/class-history.entity';

@Injectable()
export class LoaService {
  constructor(
    @InjectRepository(Loa)
    private readonly LoaRepo: Repository<Loa>,
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(ClassHistories)
    private readonly classHistoryRepo: Repository<ClassHistories>,
    @InjectRepository(Students)
    private readonly studentRepo: Repository<Students>,
  ) {}

  // async createLOA(
  //   userId: number,
  //   studentId: number,
  //   createLoaDto: CreateLoaDto,
  // ) {
  //   const student = await this.studentRepo.findOne({
  //     where: { id: studentId, parents: { id: userId } },
  //   });
  //   if (!student) throw new NotFoundException('Cannot find your child!');
  //   const createdBy = await this.userRepo.findOne({ where: { id: userId } });
  //   const classroom = await this.classHistoryRepo.findOne({
  //     where: { studentId: student.id },
  //   });
  //   createLoaDto.student = student;
  //   createLoaDto.studentId = student.id;
  //   createLoaDto.class = classroom.classroom;
  //   createLoaDto.classId = classroom.classId;
  //   createLoaDto.createdBy = createdBy;
  //   createLoaDto.createdById = createdBy.id;
  //   return await this.LoaRepo.save(createLoaDto);
  // }

  async findClassLOA(userId: number, query: QueryLoaDto) {
    const classId = query.classId;
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    const role = await this.validUserRole(userId);
    if (!role || role == 'Parent')
      throw new UnauthorizedException('You are not authorized!');
    const [data, total] = await this.LoaRepo.findAndCount({
      where: { class: { id: classId } },
      take: take,
      skip: skip,
    });

    return { data, total };
  }

  async findChildrenLOA(userId: number, query: QueryLoaDto) {
    const studentId = query.studentId;
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    const role = await this.validUserRole(userId);
    if (role == 'School Admin') {
      const [data, total] = await this.LoaRepo.findAndCount({
        where: {
          student: {
            id: studentId,
            school: { schoolAdminId: userId },
          },
        },
        take: take,
        skip: skip,
      });
      return { data, total };
    } else if (role == 'Parent') {
      const [data, total] = await this.LoaRepo.findAndCount({
        where: {
          student: {
            id: studentId,
            parents: { id: userId },
          },
        },
        take: take,
        skip: skip,
      });
      return { data, total };
    }
  }

  async findOneLoa(userId: number, loaId: number) {
    const role = await this.validUserRole(userId);
    if (role == 'School Admin') {
      const loa = this.LoaRepo.findOne({
        where: { id: loaId, class: { school: { schoolAdminId: userId } } },
      });
      if (!loa) throw new NotFoundException('Cannot find this LOA notice!');
      return loa;
    } else if (role == 'Parent') {
      const loa = this.LoaRepo.findOne({
        where: { id: loaId, student: { parents: { id: userId } } },
      });
      if (!loa)
        throw new NotFoundException('Cannot find your child LOA notice!');
      return loa;
    }
  }

  async deleteLOA(id: number) {
    return `This action removes a #${id} loa`;
  }

  private async validUserRole(userId: number) {
    const users = await this.userRepo.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!users) throw new NotFoundException('Please Login First!');
    return users.role.name;
  }
}
