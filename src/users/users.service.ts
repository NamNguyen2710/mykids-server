import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findAll(
    relations: string[] = ['schools'],
    isActive: boolean = true,
  ): Promise<Users[]> {
    return this.userRepository.find({ where: { isActive }, relations });
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
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);

    return newUser;
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

  async validateUserRole(userId: number, role: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: { name: role } },
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
