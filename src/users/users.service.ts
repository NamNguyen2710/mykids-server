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
    isActive: boolean = true,
    relations: string[] = ['schools'],
  ): Promise<Users[]> {
    return this.userRepository.find({ where: { isActive }, relations });
  }

  async findOne(userId: number, isActive: boolean = true): Promise<Users> {
    return this.userRepository.findOne({ where: { id: userId, isActive } });
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

  async validateParentClassPermission(userId: number, classId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['children', 'children.history'],
    });

    if (!user) return false;

    return user.children.some((child) =>
      child.history.some((history) => history.classId === classId),
    );
  }

  async validateParentSchoolPermission(userId: number, schoolId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['schools'],
    });

    if (!user) return false;

    return user.schools.some((school) => school.id === schoolId);
  }
}
