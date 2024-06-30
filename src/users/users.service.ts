import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './entity/users.entity';
import { Schools } from 'src/school/entities/school.entity';
import * as Role from './entity/roles.data';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Schools)
    private readonly schoolRepository: Repository<Schools>,
  ) {}

  async findAll(
    relations: string[] = ['schools'],
    query: QueryUserDto,
  ): Promise<Users[]> {
    const {
      limit = 20,
      page = 1,
      isActive = true,
      sortType = 'id',
      sortDirection = 'ASC',
    } = query;
    const whereClause = { isActive };

    if (query.q) {
      whereClause['firstName'] = query.q;
    }
    if (query.roleId) {
      whereClause['roleId'] = query.roleId;

      if (query.roleId === Role.SchoolAdmin.id) {
        if (query.schoolId) {
          whereClause['assignedSchool.id'] = query.schoolId;
        }
      }

      if (query.roleId === Role.Parent.id) {
        if (query.schoolId) {
          whereClause['schools.id'] = query.schoolId;
        }
        if (query.classId) {
          whereClause['children.student.history.classId'] = query.classId;
        }
      }
    }

    return this.userRepository.find({
      where: whereClause,
      relations,
      take: limit,
      skip: (page - 1) * limit,
      order: { [sortType]: sortDirection },
    });
  }

  async findOne(
    userId: number,
    relations: string[] = ['schools'],
    isActive: boolean = true,
  ): Promise<Users> {
    return this.userRepository.findOne({
      where: { id: userId, isActive },
      relations,
    });
  }

  async findParentProfile(userId: number) {
    return this.userRepository.findOne({
      where: {
        id: userId,
        isActive: true,
        children: {
          student: {
            isActive: true,
            history: { classroom: { isActive: true } },
          },
        },
      },
      relations: {
        children: {
          student: {
            school: true,
            history: { classroom: true },
          },
        },
      },
    });
  }

  async findOneByPhone(number: string, isActive: boolean = true) {
    return this.userRepository.findOne({
      where: { phoneNumber: number, isActive },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    if (createUserDto.roleId === Role.SuperAdmin.id) {
      delete createUserDto.schoolId;
      const newUser = this.userRepository.create(createUserDto);

      await this.userRepository.save(newUser);
      return newUser;
    }

    if (createUserDto.roleId === Role.SchoolAdmin.id) {
      const school = await this.schoolRepository.findOne({
        where: { id: createUserDto.schoolId! },
      });
      if (!school) throw new Error('School not found');

      delete createUserDto.schoolId;
      const newUser = this.userRepository.create({
        ...createUserDto,
        assignedSchool: school,
      });

      await this.userRepository.save(newUser);
      return newUser;
    }

    if (createUserDto.roleId === Role.Parent.id) {
      const newUser = this.userRepository.create(createUserDto);

      await this.userRepository.save(newUser);
      return newUser;
    }
  }

  async update(userId: number, user: Partial<Users>): Promise<Users | null> {
    const res = await this.userRepository.update(userId, user);
    if (res.affected === 0) return null;

    return this.userRepository.findOne({ where: { id: userId } });
  }

  async delete(userId: number): Promise<any> {
    const res = await this.userRepository.update(userId, { isActive: false });
    if (res.affected === 0) return null;

    return true;
  }

  async validateUserRole(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, roleId },
    });
    return !!user;
  }

  async validateParentChildrenPermission(userId: number, studentId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, children: { studentId } },
      relations: ['children'],
    });

    return !!user;
  }

  async validateParentClassPermission(userId: number, classId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, children: { student: { history: { classId } } } },
      relations: ['children', 'children.history'],
    });

    return !!user;
  }

  async validateParentSchoolPermission(userId: number, schoolId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, schools: { id: schoolId } },
      relations: ['schools'],
    });

    return !!user;
  }
}
