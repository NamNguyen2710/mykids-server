import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  EntityManager,
  ILike,
  FindOptionsWhere,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Users } from './entity/users.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { Role } from 'src/role/entities/roles.data';
import {
  CreateUserDto,
  CreateFacultySchema,
  CreateParentSchema,
  CreateSuperAdminSchema,
} from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ListResponse } from 'src/utils/list-response.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async findAll(
    relations: string[] = [],
    query: QueryUserDto,
  ): Promise<ListResponse<Users>> {
    const {
      limit = 20,
      page = 1,
      isActive,
      sort = 'id',
      order = 'ASC',
    } = query;
    const whereClause: FindOptionsWhere<Users> = {};

    if (isActive !== undefined) whereClause.isActive = isActive;

    if (query.q) {
      whereClause.firstName = ILike(`%${query.q}%`);
      whereClause.lastName = ILike(`%${query.q}%`);
    }

    if (query.roleId) {
      whereClause['roleId'] = query.roleId;

      if (query.roleId === Role.PARENT) {
        if (query.schoolId) {
          whereClause.parent = { schools: { id: query.schoolId } };
        }
        if (query.classId) {
          whereClause.parent = {
            ...((whereClause.parent as any) || {}),
            children: { student: { history: { classId: query.classId } } },
          };
        }
        if (query.phoneNumber) {
          whereClause.phoneNumber = ILike(`%${query.phoneNumber}%`);
        }
      } else if (query.roleId !== Role.SUPER_ADMIN) {
        if (query.schoolId) {
          whereClause.faculty = { schoolId: query.schoolId };
        }
        if (query.classId) {
          whereClause.faculty = {
            ...((whereClause.faculty as any) || {}),
            history: { classId: query.classId },
          };
        }
      }
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereClause,
      relations,
      take: limit,
      skip: (page - 1) * limit,
      order: { [sort]: order },
    });
    return {
      data: users,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        limit,
        page,
      },
    };
  }

  async findByIds(userIds: number[]): Promise<Users[]> {
    return this.userRepository.find({ where: { id: In(userIds) } });
  }

  async findOne(
    userId: number,
    relations: string[] = [],
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
        parent: {
          children: {
            student: {
              isActive: true,
              history: { classroom: { isActive: true } },
            },
          },
        },
      },
      relations: {
        parent: {
          children: {
            student: {
              school: true,
              history: { classroom: true },
            },
          },
        },
      },
    });
  }

  async findParentByPhone(number: string) {
    return this.userRepository.findOne({
      where: { phoneNumber: number, isActive: true, roleId: Role.PARENT },
      relations: ['role.clients'],
    });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['role.clients'],
    });
  }

  async create(
    createUserDto: CreateUserDto,
    transactionalManager?: EntityManager,
  ): Promise<Users> {
    switch (createUserDto.roleId) {
      case Role.SUPER_ADMIN: {
        const userSchema = CreateSuperAdminSchema.parse(createUserDto);

        const hashPassword = await bcrypt.hash(userSchema.password, 10);
        userSchema.password = hashPassword;

        const newUser = this.userRepository.create(userSchema);

        await this.userRepository.save(newUser);
        return newUser;
      }

      case Role.PARENT: {
        const userSchema = CreateParentSchema.parse(createUserDto);

        const newUser = this.userRepository.create(userSchema);

        const manager = transactionalManager || this.userRepository.manager;
        await manager.save(newUser);
        return newUser;
      }

      default: {
        const userSchema = CreateFacultySchema.parse(createUserDto);

        const role = await this.roleRepository.findOne({
          where: { id: userSchema.roleId },
        });
        if (!role || role.schoolId !== userSchema.faculty.schoolId) {
          throw new BadRequestException('Invalid role id');
        }

        const hashPassword = await bcrypt.hash(userSchema.password, 10);
        userSchema.password = hashPassword;

        const newUser = this.userRepository.create(userSchema);

        await this.userRepository.save(newUser);
        return newUser;
      }
    }
  }

  async update(
    userId: number,
    userDto: UpdateUserDto,
    transactionalManager?: EntityManager,
  ) {
    const user = await this.findOne(userId);
    if (!user) return null;

    Object.assign(user, userDto);
    const manager = transactionalManager || this.userRepository.manager;
    await manager.save(user);

    return this.userRepository.findOne({ where: { id: userId } });
  }

  async delete(userId: number): Promise<any> {
    const res = await this.userRepository.update(userId, { isActive: false });
    if (res.affected === 0) return null;

    return true;
  }
}
